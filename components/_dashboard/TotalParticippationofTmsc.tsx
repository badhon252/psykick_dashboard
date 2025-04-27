"use client";

import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';

// Fetch function with Authorization header
const fetchChartData = async () => {
  try {
    const token = localStorage.getItem('token'); // get token from localStorage

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/game-graph`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch:', response.status, response.statusText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const TotalParticippationofTmsc = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['game-graph'],
    queryFn: fetchChartData,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px] text-white">
        Loading chart...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[300px] text-red-500">
        Error loading chart. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <Card className="bg-[#170A2C]/50 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">
            Total Participation of TMC & ARV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#170A2C",
                    borderColor: "#333",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tmc"
                  name="TMC"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="arv"
                  name="ARV"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalParticippationofTmsc;
