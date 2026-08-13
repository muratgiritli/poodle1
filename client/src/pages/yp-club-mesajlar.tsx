import { useEffect, useRef, useState } from "react";

import { useLocation } from "wouter";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { MessageCircle, ChevronLeft, Send } from "lucide-react";

import YPLayout from "@/components/yourpoodle/YPLayout";

import { IS_YP } from "@/lib/store";

import { goBack } from "@/lib/goBack";

import { apiRequest } from "@/lib/queryClient";

import { useCustomer } from "@/contexts/CustomerContext";



const P = "#5D3A1A";

const BASE = IS_YP ? "" : "/yourpoodle";



interface Thread {

  id: number | string;

  otherDogSlug?: string;

  otherDogName?: string;

  otherDogAvatar?: string;

  otherCustomerName?: string;

  lastMessage?: string;

  lastMessageAt?: string;

  unreadCount?: number;

}



interface ChatMessage {

  id: number | string;

  body: string;

  created_at: string;

  isMine?: boolean;

  senderName?: string;

}



function formatTime(iso?: string) {

  if (!iso) return "";

  try {

    const d = new Date(iso);

    const now = new Date();

    const sameDay = d.toDateString() === now.toDateString();

    return sameDay

      ? d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })

      : d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });

  } catch {

    return "";

  }

}



export default function YPClubMesajlarPage() {

  const [, navigate] = useLocation();

  const qc = useQueryClient();

  const { isLoggedIn, isLoading: authLoading } = useCustomer();

  const [selectedThreadId, setSelectedThreadId] = useState<number | string | null>(null);

  const [draft, setDraft] = useState("");

  const [composeToSlug, setComposeToSlug] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);



  const toParam = typeof window !== "undefined"

    ? new URLSearchParams(window.location.search).get("to")

    : null;



  useEffect(() => { document.title = "Mesajlar | YourPoodle Club"; }, []);



  useEffect(() => {

    if (!authLoading && !isLoggedIn) {

      const returnTo = `${BASE}/club/mesajlar${toParam ? `?to=${encodeURIComponent(toParam)}` : ""}`;

      navigate(`${BASE}/giris?returnTo=${encodeURIComponent(returnTo)}`);

    }

  }, [authLoading, isLoggedIn, navigate, toParam]);



  const { data: threads = [], isLoading: threadsLoading, isError: threadsError } = useQuery<Thread[]>({

    queryKey: ["/api/club/messages"],

    queryFn: async () => {

      const r = await fetch("/api/club/messages", { credentials: "include" });

      if (r.status === 404) return [];

      if (!r.ok) throw new Error("Mesajlar yüklenemedi");

      const data = await r.json();

      return Array.isArray(data) ? data : data.threads ?? [];

    },

    enabled: !!isLoggedIn,

    retry: false,

  });



  useEffect(() => {

    if (!toParam || threadsLoading) return;

    const existing = threads.find(t => t.otherDogSlug === toParam);

    if (existing) {

      setSelectedThreadId(existing.id);

      setComposeToSlug(null);

    } else {

      setComposeToSlug(toParam);

      setSelectedThreadId(null);

    }

  }, [toParam, threads, threadsLoading]);



  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessage[]>({

    queryKey: ["/api/club/messages", selectedThreadId],

    queryFn: async () => {

      const r = await fetch(`/api/club/messages/${selectedThreadId}`, { credentials: "include" });

      if (!r.ok) return [];

      const data = await r.json();

      return Array.isArray(data) ? data : data.messages ?? [];

    },

    enabled: !!isLoggedIn && selectedThreadId != null,

    refetchInterval: 15_000,

  });



  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);



  const sendMutation = useMutation({

    mutationFn: async (body: string) => {

      if (selectedThreadId != null) {

        const res = await apiRequest("POST", `/api/club/messages/${selectedThreadId}`, { body });

        return res.json();

      }

      const payload: Record<string, string> = { body };

      if (composeToSlug) payload.toDogSlug = composeToSlug;

      const res = await apiRequest("POST", "/api/club/messages", payload);

      return res.json();

    },

    onSuccess: (data) => {

      setDraft("");

      qc.invalidateQueries({ queryKey: ["/api/club/messages"] });

      if (data?.threadId && selectedThreadId == null) {

        setSelectedThreadId(data.threadId);

        setComposeToSlug(null);

        if (toParam) {

          window.history.replaceState(null, "", `${BASE}/club/mesajlar`);

        }

      }

      if (selectedThreadId != null) {

        qc.invalidateQueries({ queryKey: ["/api/club/messages", selectedThreadId] });

      }

    },

  });



  const selectedThread = threads.find(t => t.id === selectedThreadId);

  const showThread = selectedThreadId != null || composeToSlug != null;

  const threadTitle = selectedThread?.otherDogName || selectedThread?.otherCustomerName || composeToSlug || "Mesaj";



  if (authLoading || !isLoggedIn) return null;



  const emptyInbox = !threadsLoading && (threadsError || threads.length === 0) && !toParam;



  return (

    <YPLayout activeLink={`${BASE}/club`} constrain={false}>

      <div style={{ maxWidth: 720, margin: "0 auto", minHeight: "100vh", background: "#FAFAFA", fontFamily: "Inter,sans-serif", display: "flex", flexDirection: "column" }}>



        {/* Header */}

        <div style={{

          background: "#fff", borderBottom: "1px solid #F0F0F0",

          padding: "0 16px", display: "flex", alignItems: "center", gap: 10,

          height: 56, position: "sticky", top: 60, zIndex: 40, flexShrink: 0,

        }}>

          <button

            aria-label="Geri"

            onClick={() => {

              if (showThread && !toParam) {

                setSelectedThreadId(null);

                setComposeToSlug(null);

              } else {

                goBack(navigate, `${BASE}/club`);

              }

            }}

            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: P, display: "flex", minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}>

            <ChevronLeft size={22} />

          </button>

          <h1 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", margin: 0, flex: 1 }}>

            {showThread ? threadTitle : "Mesajlar"}

          </h1>

        </div>



        {!showThread ? (

          /* Inbox list */

          threadsLoading ? (

            <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF" }}>Yükleniyor...</div>

          ) : emptyInbox ? (

            <div style={{

              display: "flex", flexDirection: "column", alignItems: "center",

              justifyContent: "center", padding: "80px 32px", textAlign: "center", flex: 1,

            }}>

              <div style={{

                width: 80, height: 80, borderRadius: "50%",

                background: "linear-gradient(135deg,#F5F0E6,#EDE5D8)",

                display: "flex", alignItems: "center", justifyContent: "center",

                marginBottom: 20,

              }}>

                <MessageCircle size={36} color={P} strokeWidth={1.5} />

              </div>

              <div style={{ fontSize: 19, fontWeight: 900, color: "#1a1a1a", marginBottom: 8 }}>

                Henüz mesaj yok

              </div>

              <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.6, maxWidth: 280, margin: "0 auto 28px" }}>

                Bir köpek profilinden mesaj göndererek sohbet başlatabilirsin.

              </p>

              <button type="button" onClick={() => navigate(`${BASE}/club`)}

                style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>

                Club'a Dön

              </button>

            </div>

          ) : (

            <div style={{ flex: 1, overflowY: "auto" }}>

              {threads.map(thread => (

                <button key={thread.id} type="button"

                  onClick={() => { setSelectedThreadId(thread.id); setComposeToSlug(null); }}

                  style={{

                    width: "100%", display: "flex", alignItems: "center", gap: 12,

                    padding: "14px 16px", background: "#fff", border: "none",

                    borderBottom: "1px solid #F3F4F6", cursor: "pointer", textAlign: "left", fontFamily: "inherit",

                  }}>

                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F5F0E6", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>

                    {thread.otherDogAvatar ? (

                      <img src={thread.otherDogAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                    ) : "🐾"}

                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>

                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>

                      <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>

                        {thread.otherDogName || thread.otherCustomerName || thread.otherDogSlug || "Mesaj"}

                      </span>

                      <span style={{ fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{formatTime(thread.lastMessageAt)}</span>

                    </div>

                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>

                      {thread.lastMessage || "—"}

                    </p>

                  </div>

                  {(thread.unreadCount ?? 0) > 0 && (

                    <span style={{ background: P, color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 9999, minWidth: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>

                      {thread.unreadCount}

                    </span>

                  )}

                </button>

              ))}

            </div>

          )

        ) : (

          /* Thread view */

          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>

              {composeToSlug && messages.length === 0 && !messagesLoading && (

                <div style={{ textAlign: "center", padding: "32px 16px", color: "#9CA3AF", fontSize: 14 }}>

                  @{composeToSlug} ile yeni bir sohbet başlatın.

                </div>

              )}

              {messagesLoading ? (

                <div style={{ textAlign: "center", padding: 32, color: "#9CA3AF" }}>Yükleniyor...</div>

              ) : messages.map(msg => (

                <div key={msg.id} style={{

                  display: "flex", justifyContent: msg.isMine ? "flex-end" : "flex-start", marginBottom: 10,

                }}>

                  <div style={{

                    maxWidth: "78%", padding: "10px 14px", borderRadius: 16,

                    background: msg.isMine ? P : "#fff",

                    color: msg.isMine ? "#fff" : "#111827",

                    border: msg.isMine ? "none" : "1px solid #E5E7EB",

                    fontSize: 14, lineHeight: 1.5,

                  }}>

                    {msg.body}

                    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: "right" }}>

                      {formatTime(msg.created_at)}

                    </div>

                  </div>

                </div>

              ))}

              <div ref={messagesEndRef} />

            </div>



            {/* Compose bar */}

            <div style={{

              padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",

              background: "#fff", borderTop: "1px solid #F0F0F0",

              display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0,

            }}>

              <textarea

                value={draft}

                onChange={e => setDraft(e.target.value)}

                placeholder="Mesajınızı yazın..."

                rows={1}

                onKeyDown={e => {

                  if (e.key === "Enter" && !e.shiftKey) {

                    e.preventDefault();

                    if (draft.trim() && !sendMutation.isPending) sendMutation.mutate(draft.trim());

                  }

                }}

                style={{

                  flex: 1, resize: "none", border: "1.5px solid #E5E7EB", borderRadius: 12,

                  padding: "10px 14px", fontSize: 14, fontFamily: "inherit", outline: "none",

                  maxHeight: 120, lineHeight: 1.4,

                }}

              />

              <button type="button"

                disabled={!draft.trim() || sendMutation.isPending}

                onClick={() => sendMutation.mutate(draft.trim())}

                style={{

                  width: 44, height: 44, borderRadius: 12, border: "none",

                  background: draft.trim() ? P : "#E5E7EB",

                  color: draft.trim() ? "#fff" : "#9CA3AF",

                  display: "flex", alignItems: "center", justifyContent: "center",

                  cursor: draft.trim() ? "pointer" : "default", flexShrink: 0,

                }}>

                <Send size={18} />

              </button>

            </div>

          </div>

        )}

      </div>

    </YPLayout>

  );

}


