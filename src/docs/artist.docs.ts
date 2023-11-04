/**
 * @swagger
 * /search/{artistName}:
 *   get:
 *     summary: Search for artist data.
 *     parameters:
 *       - in: path
 *         name: artistName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artist data found.
 *         content:
 *           application/json:
 *             example:
 *               artistsData: [your example data]
 *       404:
 *         description: Artist not found.
 */

/**
 * @swagger
 * /search/{artistName}/{csvFileName}:
 *   get:
 *     summary: Write artists to a CSV file.
 *     parameters:
 *       - in: path
 *         name: artistName
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: csvFileName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV File successfully created.
 *       400:
 *         description: Bad Request.
 *       404:
 *         description: Not Found.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal Error.
 */

 
