import { useMemo, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import {
  Activity,
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Flame,
  Hash,
  Heart,
  ImagePlus,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Radio,
  Search,
  Send,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import "./CommunityPage.css";

const FILTERS = [
  "All",
  "Announcement",
  "Clip",
  "Discussion",
  "Showcase",
  "Question",
  "Milestone",
];

const INITIAL_POSTS = [
  {
    id: 1,
    user: "NightOwlTV",
    initials: "NO",
    color: "#9b59b6",
    time: "2m ago",
    tag: "Milestone",
    body: "Just crossed 1k concurrent viewers last night. Couldn't have grown without this incredible community. Keep showing up. Your moment is coming.",
    likes: 247,
    comments: 63,
    shares: 19,
    views: 1840,
    liked: false,
    verified: true,
  },
  {
    id: 2,
    user: "PixelDrifter",
    initials: "PD",
    color: "#e74c3c",
    time: "18m ago",
    tag: "Discussion",
    body: "Hot take: most stream overlays are too busy. I spent three days stripping mine back, focusing on readability and gameplay. What does everyone think matters most in a professional stream setup?",
    likes: 134,
    comments: 88,
    shares: 7,
    views: 920,
    liked: false,
    verified: false,
  },
  {
    id: 3,
    user: "Velvetine",
    initials: "VL",
    color: "#1abc9c",
    time: "44m ago",
    tag: "Showcase",
    body: "Finally finished my new animated alert pack. Two weeks of work, custom transitions, and every frame hand-timed. Sharing the project with the community soon!",
    likes: 318,
    comments: 102,
    shares: 47,
    views: 2400,
    liked: true,
    verified: true,
  },
  {
    id: 4,
    user: "StormCast",
    initials: "SC",
    color: "#f39c12",
    time: "1h ago",
    tag: "Question",
    body: "Experiencing audio desync on scene transitions in OBS. It happens only with custom stingers. Has anyone found a reliable fix?",
    likes: 41,
    comments: 74,
    shares: 3,
    views: 680,
    liked: false,
    verified: false,
  },
  {
    id: 5,
    user: "ArcadeMiko",
    initials: "AM",
    color: "#3498db",
    time: "3h ago",
    tag: "Milestone",
    body: "500 followers in six weeks starting from zero. If you're in the early days, don't stop. Improve one thing every stream and keep connecting with people.",
    likes: 502,
    comments: 139,
    shares: 88,
    views: 3700,
    liked: false,
    verified: false,
  },
  {
    id: 6,
    user: "StreamSphere",
    initials: "SS",
    color: "#7567f8",
    time: "5h ago",
    tag: "Announcement",
    body: "Community Clip submissions are open! The standout clip of the week will be featured on the homepage. Share your best moment and let the community see your work.",
    likes: 891,
    comments: 204,
    shares: 163,
    views: 7200,
    liked: false,
    verified: true,
  },
];

const LIVE_STREAMS = [
  {
    user: "NightOwlTV",
    initials: "NO",
    color: "#9b59b6",
    title: "Late Night Valorant",
    game: "VALORANT",
    viewers: 1204,
  },
  {
    user: "Velvetine",
    initials: "VL",
    color: "#1abc9c",
    title: "Designing custom alerts",
    game: "CREATIVE",
    viewers: 876,
  },
  {
    user: "CosmicKai",
    initials: "CK",
    color: "#e67e22",
    title: "Minecraft Hardcore",
    game: "MINECRAFT",
    viewers: 542,
  },
  {
    user: "ZephyrFX",
    initials: "ZF",
    color: "#8e44ad",
    title: "Lo-fi chill & chat",
    game: "JUST CHATTING",
    viewers: 301,
  },
];

const MEMBERS = [
  { name: "NightOwlTV", initials: "NO", color: "#9b59b6", status: "live", role: "Partner" },
  { name: "PixelDrifter", initials: "PD", color: "#e74c3c", status: "online", role: "Creator" },
  { name: "Velvetine", initials: "VL", color: "#1abc9c", status: "live", role: "Partner" },
  { name: "StormCast", initials: "SC", color: "#f39c12", status: "online", role: "Member" },
  { name: "CosmicKai", initials: "CK", color: "#e67e22", status: "live", role: "Affiliate" },
];

const TRENDING = [
  { tag: "StreamTips", posts: "2.4K" },
  { tag: "OverlayDesign", posts: "1.8K" },
  { tag: "NewStreamer", posts: "1.5K" },
  { tag: "OBSHelp", posts: "982" },
  { tag: "ClipOfTheDay", posts: "761" },
];

const TAG_STYLES = {
  Announcement: "purple",
  Clip: "pink",
  Discussion: "orange",
  Showcase: "cyan",
  Question: "yellow",
  Milestone: "blue",
};

function Avatar({ initials, color, size = "medium", status }) {
  return (
    <div className={`cm-avatar cm-avatar-${size}`}>
      <div
        className="cm-avatar-inner"
        style={{
          "--avatar-color": color,
          background: `linear-gradient(145deg, ${color}, #15151f)`,
        }}
      >
        {initials}
      </div>

      {status && (
        <span className={`cm-status cm-status-${status}`} />
      )}
    </div>
  );
}

function SectionHeading({ icon: Icon, title, extra }) {
  return (
    <div className="cm-section-heading">
      <div className="cm-section-heading-title">
        {Icon && <Icon size={15} />}
        <span>{title}</span>
      </div>
      {extra && <span className="cm-section-extra">{extra}</span>}
    </div>
  );
}

function PostCard({ post, index, onLike, onComment, onShare }) {
  const tagStyle = TAG_STYLES[post.tag] || "purple";

  return (
    <article
      className="cm-post"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div className="cm-post-topline">
        <span className={`cm-tag cm-tag-${tagStyle}`}>
          <span className="cm-tag-dot" />
          {post.tag}
        </span>

        <button
          type="button"
          className="cm-icon-button cm-post-menu"
          aria-label="Post options"
          title="Post options"
        >
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div className="cm-post-author">
        <Avatar
          initials={post.initials}
          color={post.color}
          size="large"
        />

        <div className="cm-author-details">
          <div className="cm-author-name">
            <span>{post.user}</span>
            {post.verified && (
              <BadgeCheck
                size={15}
                className="cm-verified"
                fill="currentColor"
              />
            )}
          </div>

          <div className="cm-author-meta">
            <span>@{post.user.toLowerCase()}</span>
            <span className="cm-meta-separator">/</span>
            <span>{post.time}</span>
          </div>
        </div>
      </div>

      <p className="cm-post-body">{post.body}</p>

      {post.tag === "Showcase" && (
        <div className="cm-showcase-preview">
          <div className="cm-showcase-art">
            <div className="cm-art-orbit cm-art-orbit-one" />
            <div className="cm-art-orbit cm-art-orbit-two" />
            <Sparkles size={35} />
            <span>CREATOR SHOWCASE</span>
          </div>
          <div className="cm-showcase-caption">
            <Clapperboard size={14} />
            <span>Creative work shared with the community</span>
            <ArrowUpRight size={14} />
          </div>
        </div>
      )}

      {post.tag === "Question" && (
        <div className="cm-question-hint">
          <CircleHelp size={14} />
          <span>Community help requested</span>
        </div>
      )}

      <div className="cm-post-insights">
        <span>
          <Activity size={13} />
          {post.views.toLocaleString()} views
        </span>
        <span>{post.comments} replies</span>
      </div>

      <div className="cm-post-actions">
        <button
          type="button"
          className={`cm-post-action ${post.liked ? "is-liked" : ""}`}
          onClick={() => onLike(post.id)}
          aria-label={post.liked ? "Unlike post" : "Like post"}
        >
          <Heart
            size={16}
            fill={post.liked ? "currentColor" : "none"}
          />
          <span>{post.likes.toLocaleString()}</span>
        </button>

        <button
          type="button"
          className="cm-post-action"
          onClick={() => onComment(post)}
        >
          <MessageCircle size={16} />
          <span>{post.comments}</span>
        </button>

        <button
          type="button"
          className="cm-post-action"
          onClick={() => onShare(post)}
        >
          <Share2 size={15} />
          <span>{post.shares}</span>
        </button>

        <button
          type="button"
          className="cm-post-action cm-save-action"
          onClick={() => onShare(post)}
          aria-label="Share post"
          title="Share post"
        >
          <ArrowUpRight size={17} />
        </button>
      </div>
    </article>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("hot");
  const [search, setSearch] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postTag, setPostTag] = useState("Discussion");
  const [notice, setNotice] = useState("");
  const [commentPost, setCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});

  const notify = (message) => {
    setNotice(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setNotice(""), 2600);
  };

  const handleLike = (id) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== id) return post;

        return {
          ...post,
          liked: !post.liked,
          likes: post.likes + (post.liked ? -1 : 1),
        };
      })
    );
  };

  const handleCreatePost = (event) => {
    event.preventDefault();

    const text = postText.trim();

    if (!text) {
      notify("Write something before publishing.");
      return;
    }

    if (text.length > 280) {
      notify("Your post exceeds the 280-character limit.");
      return;
    }

    const newPost = {
      id: Date.now(),
      user: "You",
      initials: "ME",
      color: "#7567f8",
      time: "just now",
      tag: postTag,
      body: text,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      liked: false,
      verified: false,
    };

    setPosts((current) => [newPost, ...current]);
    setPostText("");
    setPostTag("Discussion");
    setComposeOpen(false);
    setFilter("All");
    setSearch("");
    setSort("new");
    notify("Your post was added to the feed.");
  };

  const filteredPosts = useMemo(() => {
    let result = posts.filter((post) => {
      const matchesFilter =
        filter === "All" || post.tag === filter;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        post.body.toLowerCase().includes(query) ||
        post.user.toLowerCase().includes(query) ||
        post.tag.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });

    if (sort === "hot") {
      result.sort(
        (a, b) => b.likes + b.comments - (a.likes + a.comments)
      );
    } else if (sort === "new") {
      result.sort((a, b) => b.id - a.id);
    } else if (sort === "top") {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [posts, filter, search, sort]);

  const handleShare = async (post) => {
    const shareText = `${post.user} on StreamSphere: ${post.body}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "StreamSphere Community",
          text: shareText,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        notify("Post copied to clipboard.");
      } else {
        notify("Sharing is not supported in this browser.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        notify("Unable to share this post.");
      }
    }
  };

  const submitComment = (event) => {
    event.preventDefault();

    if (!commentText.trim() || !commentPost) return;

    const comment = {
      id: Date.now(),
      text: commentText.trim(),
      user: "You",
    };

    setComments((current) => ({
      ...current,
      [commentPost.id]: [
        ...(current[commentPost.id] || []),
        comment,
      ],
    }));

    setPosts((current) =>
      current.map((post) =>
        post.id === commentPost.id
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );

    setCommentText("");
    notify("Reply added.");
  };

  const closeComment = () => {
    setCommentPost(null);
    setCommentText("");
  };

  return (
    <div className="cm-page">
      <Navbar />

      <main className="cm-shell">
        {/* HERO */}
        <section className="cm-hero">
          <div className="cm-hero-copy">

            <h1 className="cm-hero-title">
              Built by creators.
              <br />
              <span>Powered by community.</span>
            </h1>

            <p className="cm-hero-description">
              Your space to connect, share your work, discover
              creators and build something worth watching.
            </p>

            <div className="cm-hero-actions">
              <button
                type="button"
                className="cm-button cm-button-primary"
                onClick={() => setComposeOpen(true)}
              >
                <Plus size={17} />
                Create a post
              </button>

              <button
                type="button"
                className="cm-button cm-button-secondary"
                onClick={() =>
                  document
                    .getElementById("cm-feed")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore discussions
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="cm-community-proof">
              <div className="cm-avatar-stack">
              </div>

              <div>
                <strong>Creators move together.</strong>
                <span>Find your people. Share your progress.</span>
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY STATS */}
        <section className="cm-stats">
          {[
            { icon: Users, value: "24.8K", label: "Community members" },
            { icon: MessageCircle, value: "342", label: "Posts today" },
            { icon: Radio, value: "14", label: "Creators live" },
            { icon: TrendingUp, value: "+1.2K", label: "New this week" },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div className="cm-stat" key={stat.label}>
                <div className="cm-stat-icon">
                  <Icon size={17} />
                </div>
                <div className="cm-stat-copy">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
                <ArrowUpRight className="cm-stat-arrow" size={15} />
              </div>
            );
          })}
        </section>

        {/* MAIN CONTENT */}
        <div className="cm-layout">
          <section className="cm-feed-column" id="cm-feed">
            <div className="cm-feed-heading">
              <div>
                <div className="cm-section-kicker">
                  THE COMMUNITY FEED
                </div>
                <h2>Latest conversations<span>.</span></h2>
                <p>Ideas, milestones and moments from your community.</p>
              </div>

              <button
                type="button"
                className="cm-compose-shortcut"
                onClick={() => setComposeOpen(true)}
              >
                <Plus size={16} />
                <span>New post</span>
              </button>
            </div>

            {/* SEARCH AND SORT */}
            <div className="cm-feed-toolbar">
              <div className="cm-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search posts, creators, topics..."
                  aria-label="Search community posts"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <label className="cm-sort">
                <ArrowDownUp size={14} />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort posts"
                >
                  <option value="hot">Popular</option>
                  <option value="new">Newest</option>
                  <option value="top">Most liked</option>
                </select>
                <ChevronDown size={13} />
              </label>
            </div>

            {/* FILTER TABS */}
            <div className="cm-filters" aria-label="Post categories">
              {FILTERS.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`cm-filter ${
                    filter === item ? "active" : ""
                  }`}
                  onClick={() => setFilter(item)}
                >
                  {item === "All" && <Sparkles size={13} />}
                  {item}
                  {item === "All" && (
                    <span className="cm-filter-count">
                      {posts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="cm-results-line">
              <span>
                SHOWING <strong>{filteredPosts.length}</strong> POSTS
              </span>
              <span className="cm-feed-live">
                <span />
                FEED UPDATED LOCALLY
              </span>
            </div>

            {/* POSTS */}
            <div className="cm-post-list">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    onLike={handleLike}
                    onComment={setCommentPost}
                    onShare={handleShare}
                  />
                ))
              ) : (
                <div className="cm-empty">
                  <div className="cm-empty-icon">
                    <Search size={24} />
                  </div>
                  <h3>No conversations found</h3>
                  <p>
                    Try a different keyword or switch to another
                    category.
                  </p>
                  <button
                    type="button"
                    className="cm-button cm-button-secondary"
                    onClick={() => {
                      setSearch("");
                      setFilter("All");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="cm-feed-end">
              <div className="cm-feed-end-line" />
              <span>YOU'RE ALL CAUGHT UP</span>
              <div className="cm-feed-end-line" />
            </div>
          </section>

          {/* SIDEBAR */}
          <aside className="cm-sidebar">
            {/* LIVE STREAMS */}
            <section className="cm-panel">
              <SectionHeading
                icon={Radio}
                title="Live right now"
                extra="LIVE"
              />

              <div className="cm-live-list">
                {LIVE_STREAMS.map((stream) => (
                  <div className="cm-live-item" key={stream.user}>
                    <Avatar
                      initials={stream.initials}
                      color={stream.color}
                      size="medium"
                      status="live"
                    />

                    <div className="cm-live-info">
                      <strong>{stream.user}</strong>
                      <span>{stream.title}</span>
                      <small>{stream.game}</small>
                    </div>

                    <div className="cm-live-count">
                      <span />
                      {stream.viewers.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="cm-panel-link"
                onClick={() => notify("Live directory is a demo feature.")}
              >
                Explore live creators
                <ArrowRight size={14} />
              </button>
            </section>

            {/* TRENDING */}
            <section className="cm-panel">
              <SectionHeading
                icon={Flame}
                title="Trending topics"
                extra="TODAY"
              />

              <div className="cm-trending-list">
                {TRENDING.map((trend, index) => (
                  <button
                    type="button"
                    className="cm-trend"
                    key={trend.tag}
                    onClick={() => {
                      setSearch(trend.tag);
                      setFilter("All");
                      document
                        .getElementById("cm-feed")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span className="cm-trend-rank">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="cm-trend-info">
                      <strong>
                        <Hash size={12} />
                        {trend.tag}
                      </strong>
                      <small>{trend.posts} posts</small>
                    </span>
                    <ArrowUpRight size={14} className="cm-trend-arrow" />
                  </button>
                ))}
              </div>
            </section>

            {/* PEOPLE */}
            <section className="cm-panel">
              <SectionHeading
                icon={Users}
                title="Creators to know"
                extra="DISCOVER"
              />

              <div className="cm-member-list">
                {MEMBERS.map((member) => (
                  <div className="cm-member" key={member.name}>
                    <Avatar
                      initials={member.initials}
                      color={member.color}
                      size="medium"
                      status={member.status}
                    />

                    <div className="cm-member-info">
                      <strong>{member.name}</strong>
                      <span>{member.role}</span>
                    </div>

                    <button
                      type="button"
                      className="cm-follow"
                      onClick={() =>
                        notify(`Profile preview: ${member.name}`)
                      }
                      aria-label={`View ${member.name}`}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="cm-panel-link"
                onClick={() => notify("Member directory is a demo feature.")}
              >
                Discover the network
                <ArrowRight size={14} />
              </button>
            </section>

            {/* COMMUNITY CALL TO ACTION */}
            <section className="cm-join-panel">
              <div className="cm-join-glow" />
              <div className="cm-join-icon">
                <Sparkles size={19} />
              </div>
              <span className="cm-join-kicker">YOUR NEXT CHAPTER</span>
              <h3>Make your presence matter.</h3>
              <p>
                Share your journey, ask questions and learn from
                creators building alongside you.
              </p>
              <button
                type="button"
                className="cm-button cm-button-primary cm-join-button"
                onClick={() => setComposeOpen(true)}
              >
                Join the conversation
                <ArrowRight size={15} />
              </button>
            </section>

            <div className="cm-sidebar-footer">
              <span>STREAMSPHERE COMMUNITY</span>
              <span>CREATED FOR CREATORS.</span>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {/* CREATE POST MODAL */}
      {composeOpen && (
        <div
          className="cm-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setComposeOpen(false);
            }
          }}
        >
          <section
            className="cm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cm-compose-title"
          >
            <div className="cm-modal-header">
              <div>
                <span className="cm-section-kicker">COMMUNITY / NEW</span>
                <h2 id="cm-compose-title">Create a post<span>.</span></h2>
              </div>

              <button
                type="button"
                className="cm-icon-button"
                onClick={() => setComposeOpen(false)}
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              <div className="cm-modal-author">
                <Avatar
                  initials="ME"
                  color="#7567f8"
                  size="large"
                />
                <div>
                  <strong>You</strong>
                  <span>Posting to the StreamSphere community</span>
                </div>
              </div>

              <textarea
                className="cm-compose-textarea"
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
                placeholder="What's happening in your creator journey?"
                maxLength={280}
                autoFocus
                required
              />

              <div className="cm-compose-meta">
                <span>
                  <ImagePlus size={15} />
                  Text posts
                </span>
                <span className={postText.length >= 260 ? "near-limit" : ""}>
                  {postText.length}/280
                </span>
              </div>

              <label className="cm-category-label" htmlFor="cm-post-category">
                POST CATEGORY
              </label>

              <select
                id="cm-post-category"
                className="cm-category-select"
                value={postTag}
                onChange={(event) => setPostTag(event.target.value)}
              >
                {FILTERS.filter((item) => item !== "All").map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <div className="cm-modal-footer">
                <span>
                  <Bookmark size={13} />
                  Be respectful. Build together.
                </span>
                <button
                  type="submit"
                  className="cm-button cm-button-primary"
                  disabled={!postText.trim()}
                >
                  Publish post
                  <Send size={15} />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* LOCAL DEMO REPLIES */}
      {commentPost && (
        <div
          className="cm-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeComment();
          }}
        >
          <section
            className="cm-modal cm-replies-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cm-replies-title"
          >
            <div className="cm-modal-header">
              <div>
                <span className="cm-section-kicker">COMMUNITY / DISCUSSION</span>
                <h2 id="cm-replies-title">Conversation<span>.</span></h2>
              </div>
              <button
                type="button"
                className="cm-icon-button"
                onClick={closeComment}
                aria-label="Close conversation"
              >
                <X size={19} />
              </button>
            </div>

            <div className="cm-reply-original">
              <div className="cm-modal-author">
                <Avatar
                  initials={commentPost.initials}
                  color={commentPost.color}
                  size="large"
                />
                <div>
                  <strong>{commentPost.user}</strong>
                  <span>{commentPost.time}</span>
                </div>
              </div>
              <p>{commentPost.body}</p>
            </div>

            <div className="cm-replies-list">
              {(comments[commentPost.id] || []).length === 0 ? (
                <div className="cm-no-replies">
                  <MessageCircle size={20} />
                  <span>No replies yet. Start the conversation.</span>
                </div>
              ) : (
                comments[commentPost.id].map((comment) => (
                  <div className="cm-reply-item" key={comment.id}>
                    <Avatar initials="ME" color="#7567f8" size="small" />
                    <div>
                      <strong>{comment.user}</strong>
                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className="cm-reply-form" onSubmit={submitComment}>
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a reply..."
                aria-label="Write a reply"
                maxLength={500}
                required
              />
              <button
                type="submit"
                className="cm-button cm-button-primary"
                disabled={!commentText.trim()}
                aria-label="Send reply"
              >
                <Send size={15} />
              </button>
            </form>

            <p className="cm-demo-note">
              Replies are stored in this page's local React state.
            </p>
          </section>
        </div>
      )}

      {/* TOAST */}
      {notice && (
        <div className="cm-toast" role="status">
          <Check size={16} />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
