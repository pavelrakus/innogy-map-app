import fs from 'fs';

const TEST_URL = 'https://www.innogy.cz/kontakty/kolin/';

async function debug() {
    console.log('Fetching Kolin page...');
    const res = await fetch(TEST_URL);
    const html = await res.text();

    const clockIdx = html.indexOf('icon-svg--innogy_picto_clock');
    if (clockIdx !== -1) {
        console.log('--- FOUND CLOCK ICON. DUMPING NEXT 2000 CHARS ---');
        console.log(html.substring(clockIdx, clockIdx + 2000));
    } else {
        console.log('Clock icon not found');
    }
}

debug();
