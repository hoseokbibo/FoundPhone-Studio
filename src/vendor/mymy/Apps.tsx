import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Settings,
  Users,
  MessageCircle,
  MoreHorizontal,
  Heart,
  Home,
  Grid,
  Send,
  Bookmark,
  Repeat2,
  BarChart2,
  Share,
  User,
  Bell,
  X,
  Smile,
  Menu,
  Compass,
} from "lucide-react";
import type { SkinProps } from "../../AppSkins";
import { Avatar, Media } from "../../skins/shared";
import { useSkinState } from "../../skinState";
import { makeItem, type Item } from "../../schema";
import "./ui.css";
import "./adapter.css";

function grouped(items: Item[]) {
  return [...new Set(items.map((i) => i.title))].map((title) => ({
    title,
    items: items.filter((i) => i.title === title),
  }));
}
export function messageRun(items: Item[], index: number) {
  const m = items[index],
    previous = items[index - 1],
    next = items[index + 1];
  return {
    first: !previous || previous.outgoing !== m.outgoing || previous.sender !== m.sender,
    last: !next || next.outgoing !== m.outgoing || next.sender !== m.sender,
  };
}
const read = (p: SkinProps, i: Item) =>
  p.creator || i.password ? p.onItem(i) : p.onRead(i.id);

function Blank() { return <p className="mymy-empty">暂无内容</p>; }
function Back({ onClick }: { onClick: () => void }) {
  return <button aria-label="返回" onClick={onClick}><ArrowLeft size={22} /></button>;
}

export function MymyKakao(p: SkinProps) {
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "聊天");
  const [sent, setSent] = useState<{ id: string; sender: string; body: string; time: string; outgoing: boolean }[]>([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  
  const scroll = useRef<HTMLDivElement>(null);

  // 把内置的 p.items 和我们本地的 sent 合并显示
  const baseMessages = p.items.filter((i) => i.title === p.thread);
  const localMessages = sent.filter((s) => s.sender === p.thread || s.sender === "hope"); // hope是你的机主名
  
  const messages = [
    ...baseMessages.map(i => ({ id: i.id, sender: i.sender, body: i.body, time: i.time, outgoing: i.outgoing, media: i.media, kind: i.kind })),
    ...localMessages.map(i => ({ id: i.id, sender: i.sender, body: i.body, time: i.time, outgoing: i.outgoing, media: "", kind: "text" }))
  ].sort((a, b) => a.time.localeCompare(b.time));

  useEffect(() => {
    const node = scroll.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length, p.thread]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const msg = draft.trim();
    const now = p.virtualTime || "2026-03-21 23:00";

    // 1. 添加你的消息
    setSent(prev => [...prev, { id: "my-" + Date.now(), sender: "hope", body: msg, time: now, outgoing: true }]);
    setDraft("");

    // 2. 触发回复逻辑
    if (p.thread === "俊" || p.thread === "南俊") {
      let reply = "";
      if (msg.includes("我想你了") || msg.includes("你想我吗")) { reply = Math.random() > 0.5 ? "我也想你" : "我好想你"; }
      else if (msg.includes("我喜欢你")) { reply = Math.random() > 0.5 ? "怎么突然说这个？" : "我也喜欢你，号锡"; }
      else if (msg.includes("我爱你")) { reply = Math.random() > 0.5 ? "是想我了吗？" : "我爱你"; }
      else if (msg.includes("你在干什么") || msg.includes("在干嘛") || msg.includes("干什么")) { reply = Math.random() > 0.5 ? "为了保持身材" : "在健身房呢"; }
      else if (msg.includes("南俊")) { reply = "怎么了？"; }
      else if (msg.includes("俊")) { reply = "号锡？"; }
      else if (msg.includes("好累")) { reply = "来找我补充体力吧"; }
      else if (msg.includes("抱抱")) { reply = "明天见面吧"; }
      else if (msg.includes("亲亲") || msg.includes("啵啵") || msg.includes("030")) { reply = "😙"; }

      if (reply) {
        setTimeout(() => {
          setSent(prev => [...prev, { id: "reply-" + Date.now(), sender: "俊", body: reply, time: now, outgoing: false }]);
        }, 1000);
      }
    }
  };

  return (
    <div className="mymy-ui mymy-kakao" data-mymy="kakao">
      {p.thread ? (
        <>
          <header className="kzth">
            <Back onClick={() => p.onThread("")} />
            <span className="kzname">{p.thread}</span>
            <span className="kzpill">
              <button aria-label="聊天菜单" onClick={() => setMenu(!menu)}>
                <Menu size={21} />
              </button>
            </span>
          </header>
          <div className="msgs kk" ref={scroll}>
            {messages.map((m, i) => {
              const run = messageRun(messages as any, i);
              const prev = messages[i - 1];
              const showDate = !prev || prev.time.slice(0, 10) !== m.time.slice(0, 10);
              return (
                <div key={m.id}>
                  {showDate && <div className="kz-date"><span>🗓️ {m.time.slice(0, 10)}</span></div>}
                  <div className={"kzm " + (m.outgoing ? "kzmy" : "kzot") + (run.first ? " first" : "")}>
                    {!m.outgoing && run.first && (
                      <>
                        <div className="kzmav"><Avatar name={m.sender} /></div>
                        <div className="kzmn">{m.sender}</div>
                      </>
                    )}
                    {m.outgoing && run.last && (
                      <span className="kzt">{m.time.slice(-5)}</span>
                    )}
                    <button className={"kzbub" + (m.media ? " kzimg" : "")}>
                      {m.media ? <Media item={m as any} /> : m.body}
                    </button>
                    {!m.outgoing && run.last && (
                      <span className="kzt">{m.time.slice(-5)}</span>
                    )}
                  </div>
                </div>
              );
            })}
            {!messages.length && <Blank />}
          </div>
          <form className="kzinp" onSubmit={handleSend}>
            <button type="button" aria-label="添加聊天内容" onClick={() => (p.creator ? p.onAdd() : setMenu(!menu))}>
              <Plus size={21} />
            </button>
            <input
              aria-label="KKT消息"
              placeholder="输入消息"
              value={draft}
              maxLength={2000}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Smile size={22} />
            <button className={draft.trim() ? "go" : ""} aria-label="发送KKT消息" disabled={!draft.trim()}>
              ↑
            </button>
          </form>
        </>
      ) : (
        <div className="kzkk">
          <div className="kzhd">
            <header className="kzkh">
              <b className="kzti">{tab === "好友" ? p.owner || "好友" : "聊天"}</b>
              <span className="kzic">
                <button aria-label="搜索聊天" onClick={() => setQuery(query ? "" : " ")}><Search size={21} /></button>
                {p.creator && <button aria-label="新增内容" onClick={p.onAdd}><Plus /></button>}
                <button aria-label="KKT设置" onClick={() => setMenu(!menu)}><Settings size={21} /></button>
              </span>
            </header>
            <div className="kzkc2">
              {["好友", "聊天"].map((t) => (
                <button key={t} className={"kzkpl " + (t === tab ? "on" : "")} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>
            {query !== "" && (
              <input className="mymy-search" aria-label="搜索KKT" value={query.trimStart()} onChange={(e) => setQuery(e.target.value || " ")} placeholder="搜索" />
            )}
          </div>
          <div className="kzkb">
            <div className="kzksec">{tab === "好友" ? "好友" : "全部聊天"} {grouped(p.items).length}</div>
            {grouped(p.items).map((g) => {
              const last = g.items.at(-1)!;
              return (
                <button className="kzkr kzkcr" key={g.title} onClick={() => p.onThread(g.title)}>
                  <Avatar name={last.sender || g.title} />
                  <span className="kzkn">
                    <b>{g.title}</b>
                    <small>{tab === "好友" ? last.sender : last.body}</small>
                  </span>
                  <span className="kzkmt">{last.time.slice(-5)}</span>
                </button>
              );
            })}
            {!grouped(p.items).length && <Blank />}
          </div>
          <nav className="kzknv">
            {[Users, MessageCircle, Compass, Grid, MoreHorizontal].map((Icon, i) => (
              <button key={i} aria-label="导航" className={(tab === "好友" ? 0 : 1) === i ? "on" : ""} onClick={() => (i < 2 ? setTab(["好友", "聊天"][i]) : setMenu(true))}>
                <Icon />
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}