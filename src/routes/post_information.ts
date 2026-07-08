import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/**
 * @openapi
 * /post_information:
 *   get:
 *     summary: List all post informations
 *     tags: [PostInformation]
 *     responses:
 *       200:
 *         description: A list of post informations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   version_id:
 *                     type: integer
 *                   import_date:
 *                     type: string
 *                     format: date-time
 *                   category:
 *                     type: string
 *                   video_id:
 *                     type: string
 *                   video_title:
 *                     type: string
 *                   publish_time:
 *                     type: string
 *                     format: date-time
 *                   duration:
 *                     type: integer
 *                   engaged_views:
 *                     type: integer
 *                   average_view_duration:
 *                     type: string
 *                   average_percentage_viewed_percent:
 *                     type: number
 *                     format: float
 *                   stayed_to_watch_percent:
 *                     type: number
 *                     format: float
 *                   unique_viewers:
 *                     type: integer
 *                   unique_reach:
 *                     type: integer
 *                   average_views_per_viewer:
 *                     type: number
 *                     format: float
 *                   new_viewers:
 *                     type: integer
 *                   returning_viewers:
 *                     type: integer
 *                   casual_viewers:
 *                     type: integer
 *                   regular_viewers:
 *                     type: integer
 *                   hypes:
 *                     type: integer
 *                   hype_points:
 *                     type: integer
 *                   subscribers_gained:
 *                     type: integer
 *                   subscribers_lost:
 *                     type: integer
 *                   likes:
 *                     type: integer
 *                   dislikes:
 *                     type: integer
 *                   likes_vs_dislikes_percent:
 *                     type: number
 *                     format: float
 *                   shares:
 *                     type: integer
 *                   comments_added:
 *                     type: integer
 *                   total_sales_usd:
 *                     type: number
 *                     format: float
 *                   orders:
 *                     type: integer
 *                   approved_commissions_usd:
 *                     type: number
 *                     format: float
 *                   pending_commissions_usd:
 *                     type: number
 *                     format: float
 *                   removed_commission_usd:
 *                     type: number
 *                     format: float
 *                   youtube_premium_views:
 *                     type: integer
 *                   youtube_premium_watch_time_hours:
 *                     type: number
 *                     format: float
 *                   playlist_watch_time_hours:
 *                     type: number
 *                     format: float
 *                   views_from_playlist:
 *                     type: integer
 *                   views_per_playlist_start:
 *                     type: number
 *                     format: float
 *                   hours_streamed:
 *                     type: number
 *                     format: float
 *                   reminders_set:
 *                     type: integer
 *                   chat_messages:
 *                     type: integer
 *                   reactions:
 *                     type: integer
 *                   remix_count:
 *                     type: integer
 *                   remix_views:
 *                     type: integer
 *                   community_clip_views:
 *                     type: integer
 *                   watch_time_from_community_clips_hours:
 *                     type: number
 *                     format: float
 *                   card_clicks:
 *                     type: integer
 *                   cards_shown:
 *                     type: integer
 *                   clicks_per_card_shown_percent:
 *                     type: number
 *                     format: float
 *                   post_id:
 *                     type: string
 */
router.get('/', async (request, response) => {
    const allPostInformations = await prisma.prisma.post_information.findMany();
    console.log("All post informations: ", JSON.stringify(allPostInformations, null, 2));
    response.json(allPostInformations);
});

/**
 * @openapi
 * /post_information/{id}:
 *   get:
 *     summary: Get a post information by ID
 *     tags: [PostInformation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A post information object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 version_id:
 *                   type: integer
 *                 import_date:
 *                   type: string
 *                   format: date-time
 *                 category:
 *                   type: string
 *                 video_id:
 *                   type: string
 *                 video_title:
 *                   type: string
 *                 publish_time:
 *                   type: string
 *                   format: date-time
 *                 duration:
 *                   type: integer
 *                 engaged_views:
 *                   type: integer
 *                 average_view_duration:
 *                     type: string
 *                 average_percentage_viewed_percent:
 *                   type: number
 *                   format: float
 *                 stayed_to_watch_percent:
 *                   type: number
 *                   format: float
 *                 unique_viewers:
 *                   type: integer
 *                 unique_reach:
 *                   type: integer
 *                 average_views_per_viewer:
 *                   type: number
 *                   format: float
 *                 new_viewers:
 *                   type: integer
 *                 returning_viewers:
 *                   type: integer
 *                 casual_viewers:
 *                   type: integer
 *                 regular_viewers:
 *                   type: integer
 *                 hypes:
 *                   type: integer
 *                 hype_points:
 *                   type: integer
 *                 subscribers_gained:
 *                   type: integer
 *                 subscribers_lost:
 *                   type: integer
 *                 likes:
 *                   type: integer
 *                 dislikes:
 *                   type: integer
 *                 likes_vs_dislikes_percent:
 *                   type: number
 *                   format: float
 *                 shares:
 *                   type: integer
 *                 comments_added:
 *                   type: integer
 *                 total_sales_usd:
 *                   type: number
 *                   format: float
 *                 orders:
 *                   type: integer
 *                 approved_commissions_usd:
 *                   type: number
 *                   format: float
 *                 pending_commissions_usd:
 *                   type: number
 *                   format: float
 *                 removed_commission_usd:
 *                   type: number
 *                   format: float
 *                 youtube_premium_views:
 *                   type: integer
 *                 youtube_premium_watch_time_hours:
 *                   type: number
 *                   format: float
 *                 playlist_watch_time_hours:
 *                   type: number
 *                   format: float
 *                 views_from_playlist:
 *                   type: integer
 *                 views_per_playlist_start:
 *                   type: number
 *                   format: float
 *                 hours_streamed:
 *                   type: number
 *                   format: float
 *                 reminders_set:
 *                   type: integer
 *                 chat_messages:
 *                   type: integer
 *                 reactions:
 *                   type: integer
 *                 remix_count:
 *                   type: integer
 *                 remix_views:
 *                   type: integer
 *                 community_clip_views:
 *                   type: integer
 *                 watch_time_from_community_clips_hours:
 *                   type: number
 *                   format: float
 *                 card_clicks:
 *                   type: integer
 *                 cards_shown:
 *                   type: integer
 *                 clicks_per_card_shown_percent:
 *                   type: number
 *                   format: float
 *                 post_id:
 *                   type: string
 */
router.get('/:id', async (request, response) => {
    const postInformationId = request.params.id;
    const postInformation = await prisma.prisma.post_information.findUnique({
        where: { id: postInformationId }
    });
    console.log("Post information: ", JSON.stringify(postInformation, null, 2));
    response.json(postInformation);
});

/**
 * @openapi
 * /post_information:
 *   post:
 *     summary: Create a new post information
 *     tags: [PostInformation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [version_id, category, video_id, video_title, publish_time, post_id]
 *             properties:
 *               version_id:
 *                 type: integer
 *               import_date:
 *                 type: string
 *                 format: date-time
 *               category:
 *                 type: string
 *               video_id:
 *                 type: string
 *               video_title:
 *                 type: string
 *               publish_time:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *               engaged_views:
 *                 type: integer
 *               average_view_duration:
 *                 type: string
 *               average_percentage_viewed_percent:
 *                 type: number
 *                 format: float
 *               stayed_to_watch_percent:
 *                 type: number
 *                 format: float
 *               unique_viewers:
 *                 type: integer
 *               unique_reach:
 *                 type: integer
 *               average_views_per_viewer:
 *                 type: number
 *                 format: float
 *               new_viewers:
 *                 type: integer
 *               returning_viewers:
 *                 type: integer
 *               casual_viewers:
 *                 type: integer
 *               regular_viewers:
 *                 type: integer
 *               hypes:
 *                 type: integer
 *               hype_points:
 *                 type: integer
 *               subscribers_gained:
 *                 type: integer
 *               subscribers_lost:
 *                 type: integer
 *               likes:
 *                 type: integer
 *               dislikes:
 *                 type: integer
 *               likes_vs_dislikes_percent:
 *                 type: number
 *                 format: float
 *               shares:
 *                 type: integer
 *               comments_added:
 *                 type: integer
 *               total_sales_usd:
 *                 type: number
 *                 format: float
 *               orders:
 *                 type: integer
 *               approved_commissions_usd:
 *                 type: number
 *                 format: float
 *               pending_commissions_usd:
 *                 type: number
 *                 format: float
 *               removed_commission_usd:
 *                 type: number
 *                 format: float
 *               youtube_premium_views:
 *                 type: integer
 *               youtube_premium_watch_time_hours:
 *                 type: number
 *                 format: float
 *               playlist_watch_time_hours:
 *                 type: number
 *                 format: float
 *               views_from_playlist:
 *                 type: integer
 *               views_per_playlist_start:
 *                 type: number
 *                 format: float
 *               hours_streamed:
 *                 type: number
 *                 format: float
 *               reminders_set:
 *                 type: integer
 *               chat_messages:
 *                 type: integer
 *               reactions:
 *                 type: integer
 *               remix_count:
 *                 type: integer
 *               remix_views:
 *                 type: integer
 *               community_clip_views:
 *                 type: integer
 *               watch_time_from_community_clips_hours:
 *                 type: number
 *                 format: float
 *               card_clicks:
 *                 type: integer
 *               cards_shown:
 *                 type: integer
 *               clicks_per_card_shown_percent:
 *                 type: number
 *                 format: float
 *               post_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post information created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 version_id:
 *                   type: integer
 *                 import_date:
 *                   type: string
 *                   format: date-time
 *                 category:
 *                   type: string
 *                 video_id:
 *                   type: string
 *                 video_title:
 *                   type: string
 *                 publish_time:
 *                   type: string
 *                   format: date-time
 *                 duration:
 *                   type: integer
 *                 engaged_views:
 *                   type: integer
 *                 average_view_duration:
 *                     type: string
 *                 average_percentage_viewed_percent:
 *                   type: number
 *                   format: float
 *                 stayed_to_watch_percent:
 *                   type: number
 *                   format: float
 *                 unique_viewers:
 *                   type: integer
 *                 unique_reach:
 *                   type: integer
 *                 average_views_per_viewer:
 *                   type: number
 *                   format: float
 *                 new_viewers:
 *                   type: integer
 *                 returning_viewers:
 *                   type: integer
 *                 casual_viewers:
 *                   type: integer
 *                 regular_viewers:
 *                   type: integer
 *                 hypes:
 *                   type: integer
 *                 hype_points:
 *                   type: integer
 *                 subscribers_gained:
 *                   type: integer
 *                 subscribers_lost:
 *                   type: integer
 *                 likes:
 *                   type: integer
 *                 dislikes:
 *                   type: integer
 *                 likes_vs_dislikes_percent:
 *                   type: number
 *                   format: float
 *                 shares:
 *                   type: integer
 *                 comments_added:
 *                   type: integer
 *                 total_sales_usd:
 *                   type: number
 *                   format: float
 *                 orders:
 *                   type: integer
 *                 approved_commissions_usd:
 *                   type: number
 *                   format: float
 *                 pending_commissions_usd:
 *                   type: number
 *                   format: float
 *                 removed_commission_usd:
 *                   type: number
 *                   format: float
 *                 youtube_premium_views:
 *                   type: integer
 *                 youtube_premium_watch_time_hours:
 *                   type: number
 *                   format: float
 *                 playlist_watch_time_hours:
 *                   type: number
 *                   format: float
 *                 views_from_playlist:
 *                   type: integer
 *                 views_per_playlist_start:
 *                   type: number
 *                   format: float
 *                 hours_streamed:
 *                   type: number
 *                   format: float
 *                 reminders_set:
 *                   type: integer
 *                 chat_messages:
 *                   type: integer
 *                 reactions:
 *                   type: integer
 *                 remix_count:
 *                   type: integer
 *                 remix_views:
 *                   type: integer
 *                 community_clip_views:
 *                   type: integer
 *                 watch_time_from_community_clips_hours:
 *                   type: number
 *                   format: float
 *                 card_clicks:
 *                   type: integer
 *                 cards_shown:
 *                   type: integer
 *                 clicks_per_card_shown_percent:
 *                   type: number
 *                   format: float
 *                 post_id:
 *                   type: string
 */
router.post('/', async (request, response) => {
    const postInformation = request.body;
    console.log("Creating post information: ", JSON.stringify(postInformation, null, 2));
    const createdPostInformation = await prisma.prisma.post_information.create({
        data: postInformation
    });
    response.status(201).json(createdPostInformation);
});

/**
 * @openapi
 * /post_information/{id}:
 *   put:
 *     summary: Update a post information by ID
 *     tags: [PostInformation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               version_id:
 *                 type: integer
 *               import_date:
 *                 type: string
 *                 format: date-time
 *               category:
 *                 type: string
 *               video_id:
 *                 type: string
 *               video_title:
 *                 type: string
 *               publish_time:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *               engaged_views:
 *                 type: integer
 *               average_view_duration:
 *                 type: string
 *               average_percentage_viewed_percent:
 *                 type: number
 *                 format: float
 *               stayed_to_watch_percent:
 *                 type: number
 *                 format: float
 *               unique_viewers:
 *                 type: integer
 *               unique_reach:
 *                 type: integer
 *               average_views_per_viewer:
 *                 type: number
 *                 format: float
 *               new_viewers:
 *                 type: integer
 *               returning_viewers:
 *                 type: integer
 *               casual_viewers:
 *                 type: integer
 *               regular_viewers:
 *                 type: integer
 *               hypes:
 *                 type: integer
 *               hype_points:
 *                 type: integer
 *               subscribers_gained:
 *                 type: integer
 *               subscribers_lost:
 *                 type: integer
 *               likes:
 *                 type: integer
 *               dislikes:
 *                 type: integer
 *               likes_vs_dislikes_percent:
 *                 type: number
 *                 format: float
 *               shares:
 *                 type: integer
 *               comments_added:
 *                 type: integer
 *               total_sales_usd:
 *                 type: number
 *                 format: float
 *               orders:
 *                 type: integer
 *               approved_commissions_usd:
 *                 type: number
 *                 format: float
 *               pending_commissions_usd:
 *                 type: number
 *                 format: float
 *               removed_commission_usd:
 *                 type: number
 *                 format: float
 *               youtube_premium_views:
 *                 type: integer
 *               youtube_premium_watch_time_hours:
 *                 type: number
 *                 format: float
 *               playlist_watch_time_hours:
 *                 type: number
 *                 format: float
 *               views_from_playlist:
 *                 type: integer
 *               views_per_playlist_start:
 *                 type: number
 *                 format: float
 *               hours_streamed:
 *                 type: number
 *                 format: float
 *               reminders_set:
 *                 type: integer
 *               chat_messages:
 *                 type: integer
 *               reactions:
 *                 type: integer
 *               remix_count:
 *                 type: integer
 *               remix_views:
 *                 type: integer
 *               community_clip_views:
 *                 type: integer
 *               watch_time_from_community_clips_hours:
 *                 type: number
 *                 format: float
 *               card_clicks:
 *                 type: integer
 *               cards_shown:
 *                 type: integer
 *               clicks_per_card_shown_percent:
 *                 type: number
 *                 format: float
 *               post_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 version_id:
 *                   type: integer
 *                 import_date:
 *                   type: string
 *                   format: date-time
 *                 category:
 *                   type: string
 *                 video_id:
 *                   type: string
 *                 video_title:
 *                   type: string
 *                 publish_time:
 *                   type: string
 *                   format: date-time
 *                 duration:
 *                   type: integer
 *                 engaged_views:
 *                   type: integer
 *                 average_view_duration:
 *                     type: string
 *                 average_percentage_viewed_percent:
 *                   type: number
 *                   format: float
 *                 stayed_to_watch_percent:
 *                   type: number
 *                   format: float
 *                 unique_viewers:
 *                   type: integer
 *                 unique_reach:
 *                   type: integer
 *                 average_views_per_viewer:
 *                   type: number
 *                   format: float
 *                 new_viewers:
 *                   type: integer
 *                 returning_viewers:
 *                   type: integer
 *                 casual_viewers:
 *                   type: integer
 *                 regular_viewers:
 *                   type: integer
 *                 hypes:
 *                   type: integer
 *                 hype_points:
 *                   type: integer
 *                 subscribers_gained:
 *                   type: integer
 *                 subscribers_lost:
 *                   type: integer
 *                 likes:
 *                   type: integer
 *                 dislikes:
 *                   type: integer
 *                 likes_vs_dislikes_percent:
 *                   type: number
 *                   format: float
 *                 shares:
 *                   type: integer
 *                 comments_added:
 *                   type: integer
 *                 total_sales_usd:
 *                   type: number
 *                   format: float
 *                 orders:
 *                   type: integer
 *                 approved_commissions_usd:
 *                   type: number
 *                   format: float
 *                 pending_commissions_usd:
 *                   type: number
 *                   format: float
 *                 removed_commission_usd:
 *                   type: number
 *                   format: float
 *                 youtube_premium_views:
 *                   type: integer
 *                 youtube_premium_watch_time_hours:
 *                   type: number
 *                   format: float
 *                 playlist_watch_time_hours:
 *                   type: number
 *                   format: float
 *                 views_from_playlist:
 *                   type: integer
 *                 views_per_playlist_start:
 *                   type: number
 *                   format: float
 *                 hours_streamed:
 *                   type: number
 *                   format: float
 *                 reminders_set:
 *                   type: integer
 *                 chat_messages:
 *                   type: integer
 *                 reactions:
 *                   type: integer
 *                 remix_count:
 *                   type: integer
 *                 remix_views:
 *                   type: integer
 *                 community_clip_views:
 *                   type: integer
 *                 watch_time_from_community_clips_hours:
 *                   type: number
 *                   format: float
 *                 card_clicks:
 *                   type: integer
 *                 cards_shown:
 *                   type: integer
 *                 clicks_per_card_shown_percent:
 *                   type: number
 *                   format: float
 *                 post_id:
 *                   type: string
 */
router.put('/:id', async (request, response) => {
    const postInformationId = request.params.id;
    const postInformation = request.body;
    console.log("Updating post information with ID: ", postInformationId, " with data: ", JSON.stringify(postInformation, null, 2));
    const updatedPostInformation = await prisma.prisma.post_information.update({
        where: { id: postInformationId },
        data: postInformation
    });
    response.status(200).json(updatedPostInformation);
});

/**
 * @openapi
 * /post_information/{id}:
 *   delete:
 *     summary: Delete a post information by ID
 *     tags: [PostInformation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post information deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete('/:id', async (request, response) => {
    const postInformationId = request.params.id;
    console.log("Deleting post information with ID: ", postInformationId);
    const deletedPostInformation = await prisma.prisma.post_information.delete({
        where: { id: postInformationId }
    });
    response.status(200).json(deletedPostInformation);
});

export default router;