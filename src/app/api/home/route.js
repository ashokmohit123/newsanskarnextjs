  import { NextResponse } from "next/server";
  import pool from "@/lib/db";

  export async function GET() {
    try {
      const current_time = Date.now();
      const result_array = [];

      //const BASE_URL = "https://app.sanskargroup.in"; // Auto-fix image/video URLs

      const runQuery = async (sql, params = []) => {
        const [rows] = await pool.query(sql, params);
        return rows || [];
      };

      // 1. GET MENU MASTER
      const menu_master = await runQuery(`
        SELECT wm.id, wm.menu_title, wm.menu_type_id, mwm.type AS type
        FROM web_menu AS wm
        LEFT JOIN menu_type_master AS mwm ON wm.menu_type_id = mwm.id
        WHERE wm.status = 0 AND mwm.status = 0
        ORDER BY wm.position ASC
      `);

      // 2. LOOP THROUGH EACH MENU
      for (const menu of menu_master) {
        let list = [];
        const menuTitle = (menu.menu_title || "").toLowerCase();
        const menuType = (menu.type || "").toLowerCase();

        /* ---------------------- CHANNEL ----------------------- */
        if (menuType === "channel") {
          list = await runQuery(`
            SELECT *, 'channel' AS type
            FROM live_channel
            WHERE status = 1
            ORDER BY position ASC
          `);
        }

        /* ------------------ TRENDING VIDEO -------------------- */
        else if (menuType === "trending video") {
          list = await runQuery(
            `
            SELECT *,
              'trending video' AS type,
              (likes + youtube_likes) AS likes,
              (views + youtube_views) AS views
            FROM video_master
            WHERE status = 0
              AND published_date <= ?
              AND is_popular = 1
            ORDER BY RAND()
            LIMIT 40
          `,
            [current_time]
          );
        }

        /* ------------------- VIDEO SECTION -------------------- */
        else if (menuType === "video") {
          if (menu.menu_title === "New Release") {
            list = await runQuery(
              `
              SELECT *,
                'video' AS type,
                (likes + youtube_likes) AS likes,
                (views + youtube_views) AS views
              FROM video_master
              WHERE status = 0
                AND published_date <= ?
              ORDER BY published_date DESC
              LIMIT 15
            `,
              [current_time]
            );
          } else {
            list = await runQuery(
              `
              SELECT *,
                'video' AS type,
                (likes + youtube_likes) AS likes,
                (views + youtube_views) AS views
              FROM video_master
              WHERE status = 0
                AND published_date <= ?
                AND FIND_IN_SET(?, web_menu_ids)
              ORDER BY published_date DESC
              LIMIT 40
            `,
              [current_time, menu.id]
            );
          }
        }

        /* ----------------------- BHAJAN ----------------------- */
        else if (menuType === "bhajan") {
          list = await runQuery(
            `
            SELECT bhajan.*, 1 AS direct_play
            FROM bhajan
            WHERE status = 0
              AND FIND_IN_SET(?, web_menu_ids)
              AND published_date <= ?
            ORDER BY published_date DESC
            LIMIT 40
          `,
            [menu.id, current_time]
          );
        }

        /* ------------------------ GURU ------------------------ */
        else if (menuType === "guru") {
          list = await runQuery(`
            SELECT *
            FROM guru
            WHERE id NOT IN (1)
              AND status = 0
            ORDER BY id DESC
            LIMIT 40
          `);
        }

        /* ---------------------- Premium Season  -------------------- */
    else if (menuType === "season" || menuType === "premium season") {

  const menuMasterId = menu.id;

  const seasons = await runQuery(
    `
    SELECT 
      ps.id,
      ps.season_title,
      ps.description,
      ps.season_thumbnail,
      ps.vertical_banner,
      ps.promo_video,
      ps.yt_promo_video,
      ps.category_id,
      ps.web_menu_ids,
      ps.published_date
    FROM premium_season AS ps
    WHERE ps.status = 0
      AND ps.published_date <= ?
      AND FIND_IN_SET(?, ps.web_menu_ids)
    ORDER BY ps.position ASC
  `,
    [current_time, menuMasterId]
  );

  list = await Promise.all(
    seasons.map(async (season) => {
      const episodes = await runQuery(
        `
        SELECT 
          pe.id AS episode_id,
          pe.season_id,
          pe.episode_title,
          pe.episode_description,
          pe.thumbnail_url
        FROM premium_episodes AS pe
        WHERE pe.status = 0
          AND pe.season_id = ?
        ORDER BY pe.position ASC
      `,
        [season.id]
      );

      return {
        ...season,
        episode_count: episodes.length, // ADD THIS
        episodes: episodes || [],
      };
    })
  );
}




        /* -------------------------------------------------------
            ⭐⭐⭐ SHORT VIDEO SECTION — FULLY FIXED ⭐⭐⭐
        ------------------------------------------------------- */
        else if (menuType === "shorts" || menuTitle === "shorts video") {
          list = await runQuery(`
            SELECT 
              sv.id AS shorts_id,
              sv.title,
              sv.description,
              sv.video_url,
              sv.thumbnail
            FROM shorts_video AS sv
            WHERE sv.status = 0
            ORDER BY RAND()
            LIMIT 17
          `);

          // FIX IMAGE & VIDEO ABSOLUTE URL
          list = list.map((item) => ({
            ...item,
            thumbnail: item.thumbnail
              ? item.thumbnail.startsWith("http")
                ? item.thumbnail
                : `${BASE_URL}/${item.thumbnail}`
              : "",
            video_url: item.video_url
              ? item.video_url.startsWith("http")
                ? item.video_url
                : `${BASE_URL}/${item.video_url}`
              : "",
          }));
        }

        /* ----------------------- UPCOMING --------------------- */
        else if (menuType === "upcomming program") {
          list = await runQuery(`SELECT * FROM banner_master`);
        }

        result_array.push({ ...menu, list });
      }

      // 3. ONLY RETURN MENUS THAT HAVE DATA
      const filtered = result_array.filter(
        (item) =>
          (item.list && item.list.length > 0) ||
          ["continue watching", "upcoming season"].includes(
            item.menu_title.toLowerCase()
          )
      );

      return NextResponse.json({
        status: true,
        message: "Success",
        data: filtered,
      });
    } catch (error) {
      return NextResponse.json(
        { status: false, message: error.message },
        { status: 500 }
      );
    }
  }
