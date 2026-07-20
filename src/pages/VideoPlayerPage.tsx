import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  Share2,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { getProjectById, FEATURED_PROJECT_ID } from "../data/bookProjects";
import { showToast } from "../utils/toast";
import { publicUrl } from "../utils/asset";
import ProjectImage from "../components/ProjectImage";
import styles from "./VideoPlayerPage.module.scss";

const TABS = ["视频介绍", "关键知识", "相关项目"] as const;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function VideoPlayerPage() {
  const navigate = useNavigate();
  const project = getProjectById(FEATURED_PROJECT_ID);
  const videoInfo = project?.videoInfo;

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(videoInfo?.duration ?? 0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPoster, setShowPoster] = useState(true);

  const chapters = videoInfo?.chapters ?? [];
  const title = videoInfo?.title ?? "皮影是怎样制作出来的？";
  const subtitle = videoInfo?.subtitle ?? "华县皮影戏 · 陕西华县";
  const src = publicUrl(videoInfo?.src ?? "/assets/videos/huaxian-shadow-puppetry.mp4");
  const poster = publicUrl(videoInfo?.poster ?? "/assets/images/projects/huaxian-shadow-puppetry-hero.svg");

  const activeChapterIndex = useMemo(() => {
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTime >= chapters[i].time) return i;
    }
    return -1;
  }, [currentTime, chapters]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setIsLoaded(true);
      setDuration(video.duration || duration);
    };
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onPlay = () => {
      setIsPlaying(true);
      setShowPoster(false);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, [duration]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => showToast("视频加载中，请稍候"));
    }
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) {
      showToast("视频未加载");
      return;
    }
    video.currentTime = time;
    video.play().catch(() => showToast("视频加载中，请稍候"));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const video = videoRef.current;
    if (!bar || !video) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const nextTime = ratio * duration;
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const toggleFullscreen = async () => {
    const container = playerRef.current;
    if (!container) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch {
      showToast("全屏功能暂不可用");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} - 非遗中国地图`, text: subtitle, url });
      } catch {
        // 用户取消
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        showToast("链接已复制到剪贴板");
      } catch {
        showToast("复制失败");
      }
    } else {
      showToast("您的浏览器不支持分享");
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const renderIntroTab = () => (
    <div className={styles.tabPanel}>
      {/* 章节时间轴 */}
      <div className={styles.chapters}>
        <div className={styles.chapterList}>
          {chapters.map((ch, i) => {
            const isActive = i === activeChapterIndex;
            const isPast = i < activeChapterIndex;
            return (
              <button
                key={i}
                className={styles.chapter}
                onClick={() => seekTo(ch.time)}
              >
                <div className={styles.chapterDotLine}>
                  <span
                    className={`${styles.chapterDot} ${
                      isActive ? styles.chapterDotActive : ""
                    } ${isPast ? styles.chapterDotPast : ""}`}
                  />
                  {i < chapters.length - 1 && <span className={styles.chapterLine} />}
                </div>
                <span className={styles.chapterTime}>{formatTime(ch.time)}</span>
                <span className={styles.chapterLabel}>{ch.label}</span>
                <ChevronRight size={16} className={styles.chapterArrow} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 看完想一想 */}
      <div className={styles.thinkCard}>
        <div className={styles.thinkHeader}>
          <div className={styles.thinkIcon}>
            <HelpCircle size={18} color="#fff" />
          </div>
          <span className={styles.thinkTitle}>看完想一想</span>
        </div>
        <ul className={styles.thinkList}>
          {(videoInfo?.knowledgeQuestions ?? []).slice(0, 2).map((q, i) => (
            <li key={i} className={styles.thinkItem}>
              <span className={styles.thinkNum}>{i + 1}</span>
              <span className={styles.thinkQuestion}>{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 相关视频 */}
      <div className={styles.relatedSection}>
        <div className={styles.relatedHeader}>
          <span className={styles.relatedTitle}>相关视频</span>
          <button className={styles.relatedMore} onClick={() => setActiveTab(2)}>
            查看更多
            <ChevronRight size={14} />
          </button>
        </div>
        <div className={styles.relatedGrid}>
          {(videoInfo?.relatedContent ?? []).map((item, i) => (
            <div key={i} className={styles.relatedCard}>
              <div className={styles.relatedThumb}>
                <ProjectImage
                  src={item.thumbnail}
                  alt={item.title}
                  projectName="皮影"
                  domainColor="#B9473D"
                  className={styles.relatedImg}
                />
                <span className={styles.relatedDuration}>{item.duration}</span>
              </div>
              <h4 className={styles.relatedCardTitle}>{item.title}</h4>
              <p className={styles.relatedCardSubtitle}>{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderKnowledgeTab = () => (
    <div className={styles.tabPanel}>
      <div className={styles.thinkCard}>
        <div className={styles.thinkHeader}>
          <div className={styles.thinkIcon}>
            <HelpCircle size={18} color="#fff" />
          </div>
          <span className={styles.thinkTitle}>关键知识</span>
        </div>
        <ul className={styles.thinkList}>
          {(videoInfo?.knowledgeQuestions ?? []).map((q, i) => (
            <li key={i} className={styles.thinkItem}>
              <span className={styles.thinkNum}>Q{i + 1}</span>
              <span className={styles.thinkQuestion}>{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderRelatedTab = () => (
    <div className={styles.tabPanel}>
      <div className={styles.relatedSection}>
        <div className={styles.relatedHeader}>
          <span className={styles.relatedTitle}>相关项目</span>
        </div>
        <div className={styles.relatedGrid}>
          {(videoInfo?.relatedContent ?? []).map((item, i) => (
            <div key={i} className={styles.relatedCard}>
              <div className={styles.relatedThumb}>
                <ProjectImage
                  src={item.thumbnail}
                  alt={item.title}
                  projectName="皮影"
                  domainColor="#B9473D"
                  className={styles.relatedImg}
                />
                <span className={styles.relatedDuration}>{item.duration}</span>
              </div>
              <h4 className={styles.relatedCardTitle}>{item.title}</h4>
              <p className={styles.relatedCardSubtitle}>{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.relatedNote}>相关内容为推荐阅读，暂不支持播放</p>
    </div>
  );

  if (!project || !videoInfo) {
    return (
      <div className={styles.empty}>
        <p>视频信息未配置</p>
        <button onClick={() => navigate(-1)}>返回</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* 顶部操作栏 */}
      <header className={styles.topBar}>
        <button
          className={styles.iconBtn}
          onClick={() => navigate(-1)}
          aria-label="返回"
        >
          <ChevronLeft size={22} color="#fff" />
        </button>
        <button className={styles.iconBtn} onClick={handleShare} aria-label="分享">
          <Share2 size={18} color="#fff" />
        </button>
      </header>

      {/* 视频播放器 */}
      <div className={styles.player} ref={playerRef}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className={styles.video}
          playsInline
          preload="metadata"
          muted={isMuted}
        />

        {showPoster && !isPlaying && (
          <div className={styles.playOverlay} onClick={togglePlay}>
            <div className={styles.playButton}>
              <Play size={32} fill="#fff" color="#fff" />
            </div>
          </div>
        )}

        {/* 底部控制栏 */}
        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={togglePlay}>
            {isPlaying ? (
              <Pause size={18} color="#fff" />
            ) : (
              <Play size={18} color="#fff" fill="#fff" />
            )}
          </button>

          <span className={styles.time}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div
            className={styles.progressBar}
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button className={styles.controlBtn} onClick={toggleMute}>
            {isMuted ? (
              <VolumeX size={18} color="#fff" />
            ) : (
              <Volume2 size={18} color="#fff" />
            )}
          </button>

          <button className={styles.controlBtn} onClick={toggleFullscreen}>
            <Maximize size={18} color="#fff" />
          </button>
        </div>
      </div>

      {/* 视频信息 */}
      <div className={styles.videoInfo}>
        <h1 className={styles.videoTitle}>{title}</h1>
        <p className={styles.videoSubtitle}>
          {subtitle}
          <span className={styles.durationBadge}>{formatTime(duration)}</span>
        </p>
      </div>

      {/* 标签 */}
      <nav className={styles.tabs}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === i ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* 标签内容 */}
      <div className={styles.tabContent}>
        {activeTab === 0 && renderIntroTab()}
        {activeTab === 1 && renderKnowledgeTab()}
        {activeTab === 2 && renderRelatedTab()}
      </div>
    </div>
  );
}
