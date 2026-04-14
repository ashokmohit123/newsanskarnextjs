import styles from "./searchbar.module.css";
import Link from "next/link";

export default function SearchResults({ data }) {
  if (!data) return null;

  return (
    <div className={styles.results}>
      <ResultRow title="Premium Episodes" items={data.premiumEpisodes} />
      <ResultRow title="Premium Seasons" items={data.premiumSeasons} />
      <ResultRow title="Videos" items={data.videoMaster} />
      <ResultRow title="Bhajan" items={data.bhajan} />
    </div>
  );
}

function ResultRow({ title, items = [] }) {
  if (!items.length) return null;

  return (
    <div className={styles.section}>
      <h4 className={styles.heading}>{title}</h4>

      <div className="row">
        {items.map((item) => (
          <div key={item.id} className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <Link href={getRedirectUrl(item)} className="d-block">
              <img
                className={styles.thumb}
                src={getThumbnail(item)}
                alt={item.title}
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/no-image.png")}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ✅ IMAGE PICKER */
function getThumbnail(item) {
  return (
    item.thumbnail_url ||
    item.season_thumbnail ||
    item.thumbnail_url1 ||
    item.thumbnail1 ||
    "/no-image.png"
  );
}

/* ✅ ROUTE DECIDER */
function getRedirectUrl(item) {
  if (item.type === "premium") {
    return `/premium-details/${item.id}?type=episode`;
  }

  if (item.type === "season") {
    return `/premium-details/${item.id}?type=season`;
  }

  if (item.type === "video") {
    return `/videos/${item.id}`;
  }

  if (item.type === "bhajan") {
    return `/bhajans-details-player/${item.id}`;
  }

  return "#";
}
