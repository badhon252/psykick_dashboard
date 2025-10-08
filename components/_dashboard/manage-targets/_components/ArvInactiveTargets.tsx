/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import TableSkeleton from "@/components/shared/TableSkeleton/TableSkeleton";
import { ARVTargetResponse } from "@/components/types/ManageTarget";
import { Button } from "@/components/ui/button";
import FivosPagination from "@/components/ui/FivosPagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import StatusBadge from "./status-badge";
import { ArrowLeftIcon, Edit, Trash } from "lucide-react";

const ArvInactiveTargets = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery<ARVTargetResponse>({
    queryKey: ["all-un-queued-arv-targets", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-ARVTargetWithNullResultImage?page=${currentPage}&limit=5&sort=-createdAt`
      ).then((res) => res.json()),
  });

  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteTarget, setToDeleteTarget] = useState<{
    id: string;
    name?: string;
  } | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/delete-ARVTarget/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete");
      return data;
    },
    onSuccess: () => {
      // invalidate the list for current page so UI refreshes
      queryClient.invalidateQueries({
        queryKey: ["all-un-queued-arv-targets", currentPage],
      });
    },
    onSettled: () => setDeletingId(null),
  });

  console.log(data?.data);

  let content;
  if (isLoading) {
    content = (
      <div className="w-full py-5">
        <TableSkeleton
          count={5}
          width="100%"
          height="60px"
          className="bg-[#E6EEF6]"
        />
      </div>
    );
  } else if (isError) {
    content = (
      <div>
        <ErrorContainer message={error?.message || "Something went Wrong"} />
      </div>
    );
  } else if (data && data?.data && data?.data?.length === 0) {
    content = (
      <div className="w-full flex gap-2 items-center justify-center py-10 font-bold text-[20px] text-[#b2b2b2]">
        No ARV Target available, please
        <Link
          href={"/create-arv-target"}
          className="underline hover:text-[#8F37FF]"
        >
          add ARV Target!
        </Link>
      </div>
    );
  } else if (data && data?.data && data?.data?.length > 0) {
    if (false) {
      content = (
        <div className="w-full flex gap-2 items-center justify-center py-10 font-bold text-[20px] text-[#b2b2b2]">
          No active ARV Targets available, please{" "}
          <Link
            href={"/create-arv-target"}
            className="underline hover:text-[#8F37FF]"
          >
            Add ARV Target!
          </Link>
        </div>
      );
    } else {
      content = (
        <div>
          {[...data.data].map((target, index) => (
            <ul
              key={index}
              className="bg-white/10 shadow-[0px 20px 166.2px 4px #580EB726] my-4 border border-[#C5C5C5] rounded-[12px] p-5 grid grid-cols-7 gap-2"
            >
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                {target.eventName}
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                {target.code}
              </li>
              <StatusBadge key={target._id} status={target.status as any} />
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <div className="w-full flex flex-col items-center justify-center">
                  {moment(target.revealDuration).format("HH:mm:ss")}
                </div>
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <div className="w-full flex flex-col items-center justify-center">
                  {moment(target.outcomeDuration).format("HH:mm:ss")}
                </div>
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <Button
                  disabled={
                    target.status === "inactive" || target.status === "active"
                  }
                >
                  <Link href={`/manage-targets/set-outcome/${target._id}`}>
                    Set Outcome
                  </Link>
                </Button>
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={
                    target.status === "active" ||
                    target.status === "revealed" ||
                    target.isCompleted
                  }
                >
                  <Link
                    href={`/manage-targets/update-arv/${target.code}`}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                </Button>

                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      if (target.status === "active") return;
                      setToDeleteTarget({
                        id: target._id,
                        name: target.eventName,
                      });
                      setConfirmOpen(true);
                    }}
                    disabled={
                      target.status === "active" || deletingId === target._id
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Trash className="w-4 h-4" />
                      {deletingId === target._id ? "Deleting..." : "Delete"}
                    </div>
                  </Button>

                  <DialogPrimitive.Root
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                  >
                    <DialogPrimitive.Portal>
                      <DialogPrimitive.Overlay className="fixed inset-0 z-50 backdrop-blur-md bg-transparent data-[state=open]:animate-in data-[state=closed]:animate-out" />

                      <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-black/70 p-6 shadow-lg sm:rounded-lg dashboard-shadow">
                        <DialogHeader className="flex flex-col items-center justify-center">
                          <DialogTitle className="text-white font-semibold text-xl">
                            Confirm delete
                          </DialogTitle>
                          <DialogDescription className="text-center text-white/80 py-4">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">
                              {toDeleteTarget?.name}
                            </span>
                            ? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setConfirmOpen(false);
                                setToDeleteTarget(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                if (!toDeleteTarget) return;
                                setDeletingId(toDeleteTarget.id);
                                deleteMutation.mutate(toDeleteTarget.id);
                                setConfirmOpen(false);
                              }}
                              disabled={deletingId === toDeleteTarget?.id}
                            >
                              {deletingId === toDeleteTarget?.id
                                ? "Deleting..."
                                : "Confirm"}
                            </Button>
                          </div>
                        </DialogFooter>

                        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
                          <X className="h-4 w-4 text-white" />
                          <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>
                      </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                  </DialogPrimitive.Root>
                </>
              </li>
            </ul>
          ))}
        </div>
      );
    }
  }

  return (
    <div>
      <div className="bg-[#c4a0ff17] p-6 rounded-lg">
        <div>
          <div className="w-full flex items-center justify-between pb-[14px] md:pb-[20px] lg:pb-[25px] xl:pb-[30px]">
            <div className="flex gap-4">
              <Link href="/manage-targets" className="">
                <button className="flex items-center gap-3 bg-gradient text-base font-semibold text-white leading-[120%] py-[12px] px-[47px] rounded-tr-[24px] rounded-bl-[24px]">
                  <ArrowLeftIcon /> Manage Targets
                </button>
              </Link>
            </div>
          </div>
          <ul className="bg-[#ECECEC] py-[20px] grid grid-cols-7 gap-2">
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Event Name
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Code
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Status
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Reveal Time
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Outcome Time
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Set Outcome
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Actions
            </li>
          </ul>
        </div>
        <div>{content}</div>
        {/* pagination  */}
        <div>
          {data && data?.pagination && data?.pagination?.totalPages > 1 && (
            <div className="w-full flex items-center justify-between pt-10 pb-2">
              <p className="font-normal text-[16px] leading-[20px] text-white">
                Showing {currentPage} to {data?.pagination?.totalPages} in first
                entries
              </p>
              <div>
                <FivosPagination
                  totalPages={data?.pagination?.totalPages}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArvInactiveTargets;
