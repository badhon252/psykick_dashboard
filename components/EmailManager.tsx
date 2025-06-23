/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Reply,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  User,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type Email = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  replied?: boolean;
  replyMessage?: string;
  replySubject?: string;
};

export default function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [loadingEmailDetail, setLoadingEmailDetail] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const getToken = () => {
    // Check if we're on the client side before accessing localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const handleApiError = (error: any, defaultMessage: string) => {
    console.error(error);
    const message = error.message || defaultMessage;
    setError(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const fetchEmails = async () => {
      const token = getToken();
      if (!token) {
        handleApiError(
          { message: "Authentication required. Please log in." },
          "No token found"
        );
        setLoadingEmails(false);
        return;
      }

      try {
        setLoadingEmails(true);
        clearError();

        const res = await fetch(`${BASE_URL}/admin/all-contact-us`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (data.status) {
          setEmails(data.data || []);
        } else {
          throw new Error(data.message || "Failed to fetch emails");
        }
      } catch (error: any) {
        handleApiError(error, "Failed to fetch emails");
      } finally {
        setLoadingEmails(false);
      }
    };

    fetchEmails();
  }, []);

  const handleEmailClick = async (id: string) => {
    const token = getToken();
    if (!token) {
      handleApiError({ message: "Authentication required" }, "No token found");
      return;
    }

    try {
      setLoadingEmailDetail(true);
      clearError();

      const res = await fetch(`${BASE_URL}/admin/contact-us/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.status) {
        setSelectedEmail(data.data);
        setIsModalOpen(true);
        setIsReplyMode(false);
        setReplyMessage("");
      } else {
        throw new Error(data.message || "Failed to fetch email details");
      }
    } catch (error: any) {
      handleApiError(error, "Failed to fetch email details");
    } finally {
      setLoadingEmailDetail(false);
    }
  };

  const handleDeleteEmail = async () => {
    if (!selectedEmail) return;

    const token = getToken();
    if (!token) {
      handleApiError({ message: "Authentication required" }, "No token found");
      return;
    }

    // Show confirmation
    if (
      !window.confirm(
        "Are you sure you want to delete this email? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoadingDelete(true);
      clearError();

      const res = await fetch(
        `${BASE_URL}/admin/contact-us/${selectedEmail._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.status) {
        setEmails((prev) =>
          prev.filter((email) => email._id !== selectedEmail._id)
        );
        setIsModalOpen(false);
        setSelectedEmail(null);
        toast({
          title: "Success",
          description: "Email deleted successfully",
          variant: "default",
        });
      } else {
        throw new Error(data.message || "Failed to delete email");
      }
    } catch (error: any) {
      handleApiError(error, "Failed to delete email");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      handleApiError({ message: "Authentication required" }, "No token found");
      return;
    }

    try {
      setLoadingReply(true);
      clearError();

      const res = await fetch(
        `${BASE_URL}/admin/contact-us/reply/${selectedEmail._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ replyMessage: replyMessage.trim() }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.status) {
        // Update the email in the list
        const updatedEmail = {
          ...selectedEmail,
          replied: true,
          replyMessage: replyMessage.trim(),
          replySubject: "Reply to your contact us submission",
        };

        setEmails((prev) =>
          prev.map((email) =>
            email._id === selectedEmail._id ? updatedEmail : email
          )
        );

        setSelectedEmail(updatedEmail);
        setIsReplyMode(false);
        setReplyMessage("");

        toast({
          title: "Success",
          description: "Reply sent successfully",
          variant: "default",
        });
      } else {
        throw new Error(data.message || "Failed to send reply");
      }
    } catch (error: any) {
      handleApiError(
        error,
        "Failed to send reply. Please check your email configuration."
      );
    } finally {
      setLoadingReply(false);
    }
  };

  const filteredEmails = emails.filter((email) => {
    if (filter === "pending") return !email.replied;
    if (filter === "replied") return email.replied;
    return true;
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Today";
      if (diffDays === 2) return "Yesterday";
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const pendingCount = emails.filter((email) => !email.replied).length;
  const repliedCount = emails.filter((email) => email.replied).length;

  // Loading state
  if (loadingEmails) {
    return (
      <div className="bg-slate-900 text-white rounded-lg overflow-hidden shadow-xl">
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-slate-400">Loading emails...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && emails.length === 0) {
    return (
      <div className="bg-slate-900 text-white rounded-lg overflow-hidden shadow-xl">
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Emails</h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white rounded-lg overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Contact Messages</h2>
          </div>
          <div className="flex gap-2">
            <span className="text-xs bg-slate-700 px-2 py-1 rounded">
              Total: {emails.length}
            </span>
            <span className="text-xs bg-red-600 px-2 py-1 rounded flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Pending: {pendingCount}
            </span>
            <span className="text-xs bg-green-600 px-2 py-1 rounded flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Replied: {repliedCount}
            </span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs active:bg-black-900 !active:text-white hover:bg-purple-500 hover:text-white"
          >
            All Messages
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
            className="text-xs"
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={filter === "replied" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("replied")}
            className="text-xs"
          >
            Replied ({repliedCount})
          </Button>
        </div>
      </div>

      {/* Email List */}
      <div className="max-h-screen overflow-y-auto">
        {filteredEmails.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No messages found</p>
            {filter !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("all")}
                className="mt-2 text-xs"
              >
                Show All Messages
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {[...filteredEmails].reverse().map((email) => (
              <div
                key={email._id}
                className="flex items-center p-4 hover:bg-slate-800/50 cursor-pointer transition-all duration-200 group"
                onClick={() => handleEmailClick(email._id)}
              >
                <Avatar className="h-12 w-12 mr-4 ring-2 ring-slate-700 group-hover:ring-purple-500 transition-all">
                  <AvatarImage src="/placeholder.svg" alt={email.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold">
                    {email.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white truncate">
                      {email.name}
                    </p>
                    {email.replied ? (
                      <span className="text-xs bg-green-600 px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Replied
                      </span>
                    ) : (
                      <span className="text-xs bg-red-600 px-2 py-1 rounded flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm truncate">
                    {email.email}
                  </p>
                  <p className="text-slate-300 text-sm truncate mt-1 font-medium">
                    {email.subject}
                  </p>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(email.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-slate-900 text-white border-slate-700 max-h-[80vh] overflow-y-auto">
          {loadingEmailDetail ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-purple-400" />
              <p className="text-slate-400">Loading email details...</p>
            </div>
          ) : selectedEmail ? (
            <div>
              <DialogHeader className="pb-4">
                <DialogTitle className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  Message Details
                </DialogTitle>
              </DialogHeader>

              {/* Sender Info */}
              <div className="mb-4 bg-slate-800 border border-slate-700 rounded-lg">
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={selectedEmail.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold">
                        {selectedEmail.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="font-semibold">
                          {selectedEmail.name}
                        </span>
                        {selectedEmail.replied ? (
                          <span className="text-xs bg-green-600 px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Replied
                          </span>
                        ) : (
                          <span className="text-xs bg-red-600 px-2 py-1 rounded flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Needs Reply
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">
                        {selectedEmail.email}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(selectedEmail.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Message */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-purple-400 mb-2">
                    Subject
                  </h3>
                  <p className="text-slate-300 bg-slate-800 p-3 rounded-lg border border-slate-700">
                    {selectedEmail.subject}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-purple-400 mb-2">
                    Message
                  </h3>
                  <div className="text-slate-300 bg-slate-800 p-4 rounded-lg border border-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedEmail.message}
                  </div>
                </div>

                {/* Previous Reply */}
                {selectedEmail.replied && selectedEmail.replyMessage && (
                  <div>
                    <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <Reply className="h-4 w-4" />
                      Your Reply
                    </h3>
                    <div className="text-slate-300 bg-green-950/30 p-4 rounded-lg border border-green-800/50 whitespace-pre-wrap leading-relaxed">
                      {selectedEmail.replyMessage}
                    </div>
                  </div>
                )}

                <div className="h-px bg-slate-700 my-4"></div>

                {/* Reply Section */}
                {!isReplyMode ? (
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-3">
                      <Button
                        variant="default"
                        onClick={() => setIsReplyMode(true)}
                        className="bg-purple-600 hover:bg-purple-700"
                        disabled={selectedEmail.replied}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        {selectedEmail.replied ? "Already Replied" : "Reply"}
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteEmail}
                      disabled={loadingDelete}
                      size="sm"
                    >
                      {loadingDelete ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      {loadingDelete ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div>
                      <h3 className="font-semibold text-purple-400 mb-2">
                        Write Your Reply
                      </h3>
                      <textarea
                        placeholder="Type your reply message here..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full min-h-[120px] p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none resize-y"
                        rows={5}
                        maxLength={5000}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {replyMessage.length}/5000 characters
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSendReply}
                          disabled={!replyMessage.trim() || loadingReply}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {loadingReply ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          {loadingReply ? "Sending..." : "Send Reply"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsReplyMode(false);
                            setReplyMessage("");
                          }}
                          className="border-slate-600 text-slate-300 hover:bg-slate-800"
                          disabled={loadingReply}
                        >
                          Cancel
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteEmail}
                        disabled={loadingDelete || loadingReply}
                        size="sm"
                      >
                        {loadingDelete ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        {loadingDelete ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
