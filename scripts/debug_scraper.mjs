import fs from 'fs';

const BASE_URL = 'https://www.innogy.cz';
const TEST_URL = 'https://www.innogy.cz/kontakty/brno/';

async function debug() {
    console.log('Fetching test page...');
    const res = await fetch(TEST_URL);
    const html = await res.text();

    console.log('--- HTML SNIPPET AROUND ADRESA ---');
    const idx = html.indexOf('Adresa');
    if (idx !== -1) {
        console.log(html.substring(idx, idx + 500));
    } else {
        console.log('Word "Adresa" not found in HTML');
    }
}

debug();
