"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

type Email = {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

export function EmailList() {
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const getToken = () => {
    return localStorage.getItem("token")
  }

  useEffect(() => {
    const fetchEmails = async () => {
      const token = getToken()
      if (!token) {
        console.error("No token found")
        return
      }

      try {
        const res = await fetch(`${BASE_URL}/admin/all-contact-us`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (data.status) {
          setEmails(data.data)
        } else {
          console.error("Failed to fetch emails", data.message)
        }
      } catch (error) {
        console.error("Error fetching emails:", error)
      }
    }

    fetchEmails()
  }, [])

  const handleEmailClick = async (id: string) => {
    const token = getToken()
    if (!token) {
      console.error("No token found")
      return
    }

    try {
      const res = await fetch(`${BASE_URL}/admin/contact-us/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data.status) {
        setSelectedEmail(data.data)
        setIsModalOpen(true)
      } else {
        console.error("Failed to fetch email details", data.message)
      }
    } catch (error) {
      console.error("Error fetching email details:", error)
    }
  }

  const handleDeleteEmail = async () => {
    if (!selectedEmail) return
    const token = getToken()
    if (!token) {
      console.error("No token found")
      return
    }

    try {
      setLoadingDelete(true)
      const res = await fetch(`${BASE_URL}/admin/contact-us/${selectedEmail._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()

      if (data.status) {
        // After delete, remove from emails list
        setEmails((prev) => prev.filter((email) => email._id !== selectedEmail._id))
        setIsModalOpen(false)
        setSelectedEmail(null)
      } else {
        console.error("Failed to delete email", data.message)
      }
    } catch (error) {
      console.error("Error deleting email:", error)
    } finally {
      setLoadingDelete(false)
    }
  }

  return (
    <div className="text-white rounded-lg overflow-hidden">
      <div className="p-4 border-b border-purple-800">
        <h2 className="text-xl font-semibold">New</h2>
      </div>
      <div className="divide-y divide-purple-800">
        {emails.map((email) => (
          <div
            key={email._id}
            className="flex items-center p-4 hover:bg-purple-800 cursor-pointer transition-colors"
            onClick={() => handleEmailClick(email._id)}
          >
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src="/placeholder.svg" alt={email.name} />
              <AvatarFallback className="bg-purple-700">
                {email.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{email.name}</p>
              <p className="text-gray-400">{email.email}</p>
            </div>
            <div className="text-sm text-purple-200">
              {new Date(email.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-900">
        

          {selectedEmail && (
            <div>
              <div className="flex items-center gap-4 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt={selectedEmail.name} />
                  <AvatarFallback className="bg-purple-700">
                    {selectedEmail.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedEmail.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEmail.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 whitespace-pre-line"><span className="font-bold">Sbuject:</span> {selectedEmail?.subject}</div> <br />
              <div className="mt-2 whitespace-pre-line"><span className="font-bold">Body:</span> {selectedEmail.message}</div>

              {/* Delete button */}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleDeleteEmail}
                  disabled={loadingDelete}
                >
                  {loadingDelete ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
