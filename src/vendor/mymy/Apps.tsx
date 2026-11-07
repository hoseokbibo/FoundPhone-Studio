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
  const [sent, setSent] = useState<{ id: string; thread: string; sender: string; body: string; time: string; outgoing: boolean }[]>([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  
  const scroll = useRef<HTMLDivElement>(null);

  const baseMessages = p.items.filter((i) => i.title === p.thread);
  const localMessages = sent.filter((s) => s.thread === p.thread);
  
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

    setSent(prev => [...prev, { id: "my-" + Date.now(), thread: p.thread, sender: "hope", body: msg, time: now, outgoing: true }]);
    setDraft("");

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
      // --- 吃醋与拉扯 ---
      else if (msg.includes("硕珍哥") || msg.includes("玧其哥") || msg.includes("智旻") || msg.includes("泰亨") || msg.includes("柾国")) { reply = "老是提他们干什么…"; }
      else if (msg.includes("吃醋")) { reply = "嗯"; }
      else if (msg.includes("生气") || msg.includes("别生气")) { reply = "我没对你生气过"; }
      else if (msg.includes("不理我") || msg.includes("怎么不回")) { reply = "刚刚在忙，没有看手机"; }
      
      // --- 撒娇与日常 ---
      else if (msg.includes("无聊") || msg.includes("好无聊")) { reply = "那明天见一面吗？"; }
      else if (msg.includes("好看吗") || msg.includes("帅吗") || msg.includes("漂亮吗")) { reply = "喜欢"; }
      else if (msg.includes("减肥")) { reply = "抱起来会不舒服的，多吃一点饭吧"; }
      else if (msg.includes("在吃饭")) { reply = "我突然有点饿…可以来找你一起吃吗？"; }
      else if (msg.includes("好饿")) { reply = "想吃什么？甜品还是…？"; }
      
      // --- 酒局查岗 ---
      else if (msg.includes("喝酒")) { reply = "跟谁？在哪里？为什么不叫我一起？等等谁送你回家？"; }
      
      // --- 天气与约会 ---
      else if (msg.includes("晴天") || msg.includes("天气好好") || msg.includes("天气真好")) { reply = "那要出去约会吗？"; }
      else if (msg.includes("下雨") || msg.includes("雨天")) { reply = "出门记得带伞，不要感冒"; }
      
      // --- 早晚安 ---
      else if (msg.includes("早安")) { reply = "早"; }
      else if (msg.includes("晚安")) { reply = "我们号锡今天也辛苦了"; }

      if (reply) {
        setTimeout(() => {
          setSent(prev => [...prev, { id: "reply-" + Date.now(), thread: p.thread, sender: "俊", body: reply, time: now, outgoing: false }]);
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

export function MymyInstagram(p: SkinProps) {
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "主页"),
    [liked, setLiked] = useSkinState<string[]>(p, "mymyLiked", []),
    [saved, setSaved] = useSkinState<string[]>(p, "mymySaved", []),
    [replies, setReplies] = useSkinState<string[]>(p, "mymyReplies", []),
    [seen, setSeen] = useSkinState<string[]>(p, "mymySeen", []);
  const [sheet, setSheet] = useState<Item | null>(null),
    [selected, setSelected] = useState<Item | null>(null),
    [story, setStory] = useState(0),
    [draft, setDraft] = useState(""),
    [pop, setPop] = useState("");
  const posts = p.items.filter((i) => i.folder !== "私信" && i.meta.story !== "true"),
    stories = p.items.filter((i) => i.meta.story === "true"),
    dms = p.items.filter((i) => i.folder === "私信"),
    active = stories[story - 1];
  const toggle = (id: string, values: string[], set: (v: string[]) => void) =>
    set(values.includes(id) ? values.filter((v) => v !== id) : [...values, id]);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStory((n) => (n < stories.length ? n + 1 : 0)), 5000);
    return () => clearTimeout(t);
  }, [active, stories.length]);
  const openStory = (i: number) => {
    const m = stories[i];
    setSeen([...new Set([...seen, m.id])]);
    read(p, m);
    setStory(i + 1);
  };
  const openPost = (i: Item) => {
    if (p.creator || i.password) p.onItem(i);
    else {
      read(p, i);
      setSelected(i);
    }
  };
  const post = (i: Item) => (
    <article className="igp" key={i.id}>
      <header className="igph">
        <Avatar name={i.sender} src={i.avatar} />
        <div className="igpn">
          <button onClick={() => setTab("个人主页")}><b>{i.sender}</b></button>
          <small>{i.meta.location || i.time}</small>
        </div>
        <button aria-label="帖子详情" onClick={() => openPost(i)}><MoreHorizontal /></button>
      </header>
      <div className="carw" onDoubleClick={() => { if (!liked.includes(i.id)) setLiked([...liked, i.id]); setPop(i.id); }}>
        <Media item={i} />
        {pop === i.id && <Heart className="mymy-heart-pop" fill="white" onAnimationEnd={() => setPop("")} />}
      </div>
      <div className="iga">
        <button aria-label={"点赞" + i.title} aria-pressed={liked.includes(i.id)} onClick={() => toggle(i.id, liked, setLiked)}>
          <Heart fill={liked.includes(i.id) ? "#ff3040" : "none"} color={liked.includes(i.id) ? "#ff3040" : "currentColor"} />
        </button>
        <button aria-label={"评论" + i.title} onClick={() => { read(p, i); setSheet(i); }}><MessageCircle /></button>
        <button aria-label="分享帖子" onClick={() => setTab("私信")}><Send /></button>
        <button className="mymy-save" aria-label={"收藏" + i.title} aria-pressed={saved.includes(i.id)} onClick={() => toggle(i.id, saved, setSaved)}>
          <Bookmark fill={saved.includes(i.id) ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="lk2">{i.likes + (liked.includes(i.id) ? 1 : 0)} 次赞</p>
      <button className="igc" onClick={() => { openPost(i); }}>
        <b>{i.sender}</b> {i.body}
      </button>
      <button className="cmall" onClick={() => setSheet(i)}>
        查看评论 {i.comments.length + replies.filter((r) => r.startsWith(i.id + "\t")).length}
      </button>
      <p className="igt">{i.time}</p>
    </article>
  );
  return (
    <div className="mymy-ui mymy-instagram" data-mymy="instagram">
      <div className="ig">
        <header className="igh">
          <button aria-label={selected ? "返回Instagram动态" : "关闭当前App"} onClick={() => (selected ? setSelected(null) : p.onBack())}><ArrowLeft /></button>
          <span className="igl2">{selected ? "帖子" : tab === "主页" ? "Instagram" : tab}</span>
          <button aria-label="打开私信" onClick={() => setTab("私信")}><Send /></button>
        </header>
        <div className="igb">
          {selected && post(selected)}
          {!selected && tab === "主页" && (
            <>
              <div className="sts">
                {stories.map((s, n) => (
                  <button className="st" key={s.id} onClick={() => openStory(n)}>
                    <span className={"sr on " + (seen.includes(s.id) ? "seen" : "")}>
                      <Avatar name={s.sender} src={s.avatar} />
                    </span>
                    <small>{s.sender}</small>
                  </button>
                ))}
              </div>
              {posts.map(post)}
              {!posts.length && <Blank />}
            </>
          )}
          {!selected && tab === "个人主页" && (
            <>
              <div className="pf">
                <Avatar name={p.owner || "机主"} />
                <div className="ps">
                  <div><b>{posts.length}</b><small>帖子</small></div>
                  <div><b>—</b><small>粉丝</small></div>
                  <div><b>—</b><small>关注</small></div>
                </div>
              </div>
              <p className="pn">{p.owner}</p>
              <div className="ptab"><div className="on"><Grid /></div></div>
              <div className="pg2">
                {posts.map((i) => (
                  <button key={i.id} onClick={() => openPost(i)}><Media item={i} /></button>
                ))}
              </div>
            </>
          )}
          {!selected && tab === "私信" && (
            <>
              {dms.map((i) => (
                <button className="kzkr" key={i.id} onClick={() => openPost(i)}>
                  <Avatar name={i.sender} src={i.avatar} />
                  <span className="kzkn"><b>{i.title}</b><small>{i.body}</small></span>
                </button>
              ))}
              {!dms.length && <Blank />}
            </>
          )}
          {!selected && tab === "搜索" && (
            <>
              <input className="mymy-search" aria-label="搜索Instagram" placeholder="搜索" value={draft} onChange={(e) => setDraft(e.target.value)} />
              {posts.filter((i) => (i.title + i.body + i.sender).includes(draft)).map(post)}
            </>
          )}
        </div>
        <nav className="mymy-ig-nav">
          {[Home, Search, Send, User].map((Icon, n) => (
            <button key={n} aria-label={["主页", "搜索", "私信", "个人主页"][n]} aria-pressed={!selected && tab === ["主页", "搜索", "私信", "个人主页"][n]} onClick={() => { setSelected(null); setTab(["主页", "搜索", "私信", "个人主页"][n]); }}>
              <Icon />
            </button>
          ))}
        </nav>
      </div>
      {sheet && (
        <div className="kzcs">
          <button className="kzbk" aria-label="关闭评论" onClick={() => setSheet(null)} />
          <section className="kzsh" role="dialog" aria-label="Instagram评论">
            <div className="mymy-sheet-handle" />
            <header><b>评论</b><button aria-label="关闭评论面板" onClick={() => setSheet(null)}><X /></button></header>
            <div className="mymy-comments">
              {[...sheet.comments, ...replies.filter((r) => r.startsWith(sheet.id + "\t")).map((r) => r.split("\t").slice(1).join("\t"))].map((c, n) => (
                <p key={n}><Avatar name={c.split(":")[0]} />{c}</p>
              ))}
            </div>
            <form className="cmb2" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { setReplies([...replies, sheet.id + "\t" + draft.trim()]); setDraft(""); } }}>
              <input aria-label="添加评论" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="添加评论" maxLength={500} />
              <button>发布</button>
            </form>
          </section>
        </div>
      )}
      {active && (
        <div className="mymy-story" onPointerDown={(e) => { const box = e.currentTarget.getBoundingClientRect(); const next = e.clientX - box.left < box.width * 0.3 ? story - 1 : story + 1; setStory(next > stories.length ? 0 : Math.max(0, next)); }}>
          <div className="mymy-story-bars">{stories.map((s, n) => (<i key={s.id} className={n < story ? "seen" : ""} />))}</div>
          <header>
            <Avatar name={active.sender} src={active.avatar} />
            <b>{active.sender}</b>
            <button aria-label="关闭快拍" onPointerDown={(e) => e.stopPropagation()} onClick={() => setStory(0)}><X /></button>
          </header>
          <Media item={active} />
          <p>{active.body}</p>
        </div>
      )}
    </div>
  );
}

export function MymyX(p: SkinProps) {
  const [dark, setDark] = useSkinState<boolean>(p, "x-dark", true);
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "推荐"),
    [likes, setLikes] = useSkinState<string[]>(p, "mymyXLikes", []),
    [reposts, setReposts] = useSkinState<string[]>(p, "mymyXReposts", []),
    [marks, setMarks] = useSkinState<string[]>(p, "mymyXMarks", []),
    [query, setQuery] = useState("");
  const isLiked = (id: string) => typeof p.ui?.["liked-" + id] === "boolean" ? Boolean(p.ui["liked-" + id]) : likes.includes(id);
  const isSaved = (id: string) => typeof p.ui?.["saved-" + id] === "boolean" ? Boolean(p.ui["saved-" + id]) : marks.includes(id);
  const toggle = (id: string, v: string[], set: (x: string[]) => void) => set(v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
  return (
    <div className={"mymy-ui mymy-x " + (dark ? "x-reference-dark" : "")} data-mymy="twitter">
      <div className="kzxw">
        <header className="kzxh">
          <button aria-label="关闭当前App" onClick={p.onBack}><ArrowLeft /></button>
          <div className="kzxlg">𝕏</div>
          <button aria-label="切换X外观" onClick={() => setDark(!dark)}><User /></button>
        </header>
        <div className="kzxtb">
          {["为你推荐", "正在关注", "添加 +", "时间"].map((t) => (
            <button className={t === tab ? "on" : ""} key={t} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        {tab === "搜索" && (
          <input className="mymy-search" aria-label="搜索X" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索" />
        )}
        <div className="kzxfd">
          {p.items.filter((i) => (i.title + i.body).includes(query)).map((i) => (
            <article className="kzxt" key={i.id}>
              <Avatar name={i.sender} src={i.avatar} />
              <div className="kzxb">
                <div className="kzxn">
                  <b>{i.sender}</b>
                  <small>@{i.meta.handle || "user"} · {i.time.slice(-5)}</small>
                  <em><MoreHorizontal size={18} /></em>
                </div>
                <button className="kzxx" onClick={() => { read(p, i); p.onItem(i); }}>{i.body}</button>
                {i.media && (
                  <button className="kzxv" aria-label="打开媒体" onClick={() => p.onItem(i)}><Media item={i} /></button>
                )}
                <div className="kzxac">
                  <button aria-label={"评论" + i.title} onClick={() => p.onItem(i)}><MessageCircle />{i.comments.length}</button>
                  <button aria-label={"转发" + i.title} aria-pressed={reposts.includes(i.id)} onClick={() => toggle(i.id, reposts, setReposts)}>
                    <Repeat2 />{reposts.includes(i.id) ? 1 : 0}
                  </button>
                  <button aria-label={"点赞" + i.title} aria-pressed={isLiked(i.id)} onClick={() => { toggle(i.id, likes, setLikes); p.onUi?.("liked-" + i.id, !isLiked(i.id)); }}>
                    <Heart fill={isLiked(i.id) ? "#f91880" : "none"} />{i.likes + (isLiked(i.id) ? 1 : 0)}
                  </button>
                  <span><BarChart2 />{i.meta.views || "—"}</span>
                  <button aria-label={"收藏" + i.title} aria-pressed={isSaved(i.id)} onClick={() => { toggle(i.id, marks, setMarks); p.onUi?.("saved-" + i.id, !isSaved(i.id)); }}><Bookmark /></button>
                  <button aria-label="分享" onClick={() => p.onItem(i)}><Share /></button>
                </div>
              </div>
            </article>
          ))}
          {!p.items.length && <Blank />}
        </div>
        <nav className="kzxnav">
          {[Home, Search, Bell, MessageCircle].map((Icon, n) => (
            <button key={n} aria-label={["时间线", "搜索", "通知", "私信"][n]} onClick={() => n < 2 && setTab(n ? "搜索" : "推荐")} disabled={n > 1}><Icon /></button>
          ))}
        </nav>
      </div>
    </div>
  );
}