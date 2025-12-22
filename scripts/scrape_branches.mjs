import fs from 'fs';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.innogy.cz';
const LIST_URL = 'https://www.innogy.cz/kontakty/seznam-pobocek/';

async function fetchPage(url) {
    console.log(`Fetching ${url}...`);
    const res = await fetch(url);
    return await res.text();
}

async function scrape() {
    console.log('Starting scrape...');
    const listHtml = await fetchPage(LIST_URL);
    const $list = cheerio.load(listHtml);

    const branches = [];
    const linkSet = new Set();

    // Find all links to contacts
    $list('a[href^="/kontakty/"]').each((_, el) => {
        const href = $list(el).attr('href');
        if (href && href.split('/').length === 4) { // /kontakty/slug/
            const slug = href.split('/')[2];
            if (!['seznam-pobocek', 'mapa', 'podklady', 'zakaznicka-linka', 'kariera', 'o-innogy', 'press-centrum', 'ochrana-osobnich-udaju'].includes(slug)) {
                linkSet.add(slug);
            }
        }
    });

    const slugs = [...linkSet];
    console.log(`Found ${slugs.length} potential branches.`);

    for (const slug of slugs) {
        const url = `${BASE_URL}/kontakty/${slug}/`;

        try {
            const html = await fetchPage(url);
            const $ = cheerio.load(html);

            // 1. Name
            let name = $('h1').first().text().trim();
            name = name.replace('Pobočka ', '').replace('Zákaznické centrum ', '').trim();
            if (!name) name = slug;

            // 2. GPS (Regex is still often easiest for script tags or data attributes if not in DOM text)
            // Looking for GPS: 50.02, 14.22
            const htmlText = $.html();
            const gpsMatch = htmlText.match(/GPS:\s*(\d+\.\d+),\s*(\d+\.\d+)/);
            let lat = 0, lng = 0;
            if (gpsMatch) {
                lat = parseFloat(gpsMatch[1]);
                lng = parseFloat(gpsMatch[2]);
            }

            // 3. Address
            let address = "Adresa nenalezena";

            // Strategy: Find Header "Adresa" and take next element
            const $adresaHeader = $('h2, h3, h4, strong, b').filter((_, el) => $(el).text().trim() === 'Adresa').first();

            if ($adresaHeader.length) {
                const $next = $adresaHeader.next();
                if ($next.length) {
                    address = $next.html()
                        .replace(/<br\s*\/?>/gi, ', ')
                        .replace(/<[^>]+>/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                }
            }

            // Fallback for address if generic
            if (address === "Adresa nenalezena") {
                // Try looking for older class just in case
                $('.b-contact-info').each((_, el) => {
                    if ($(el).text().includes('Adresa')) {
                        const p = $(el).find('p').first();
                        if (p.length) address = p.text().replace(/\s+/g, ' ').trim();
                    }
                });
            }

            // 4. Opening Hours
            const openingHours = [];
            // Strategy: Find Header "Otevírací doba" and take next element
            const $hoursHeader = $('h2, h3, h4, strong, b').filter((_, el) => $(el).text().includes('Otevírací doba')).first();

            if ($hoursHeader.length) {
                const $next = $hoursHeader.next();
                // It can be a div with p's or a table
                // Try text content of p's
                $next.find('p, tr').each((_, row) => {
                    const text = $(row).text().replace(/\s+/g, ' ').trim();
                    if (text) openingHours.push(text);
                });

                // If empty, maybe the next element IS the text? (unlikely for hours list)
                if (openingHours.length === 0) {
                    // Check for spans directly in next
                    const text = $next.text().replace(/\s+/g, ' ').trim();
                    if (text) openingHours.push(text);
                }
            } else {
                // Fallback to class search
                const $hoursDiv = $('.b-contact-info__hours');
                if ($hoursDiv.length) {
                    $hoursDiv.find('p').each((_, el) => {
                        openingHours.push($(el).text().replace(/\s+/g, ' ').trim());
                    });
                }
            }

            if (openingHours.length === 0) {
                openingHours.push("Po–Pá 8:00–17:00 (Ověřte na webu)");
            }

            console.log(`Parsed ${slug}: ${name} - ${address}`);

            branches.push({
                id: slug,
                city: name,
                name: `Pobočka ${name}`,
                address,
                lat,
                lng,
                email: 'info@innogy.cz',
                phone: '800 11 33 55',
                openingHours
            });

        } catch (e) {
            console.error(`Error parsing ${slug}:`, e);
        }
    }

    // Output to TS file
    const tsContent = `import { Branch } from '../types';

export const BRANCHES: Branch[] = ${JSON.stringify(branches, null, 2)};
`;
    // Also save a raw JSON for easy verification
    fs.writeFileSync('src/locations.json', JSON.stringify(branches, null, 2));
    fs.writeFileSync('src/data/branches.ts', tsContent);
    console.log(`Saved ${branches.length} branches to src/data/branches.ts and src/locations.json`);
}

scrape();
