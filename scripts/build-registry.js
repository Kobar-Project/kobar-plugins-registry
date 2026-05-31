const fs = require('fs');

async function main() {
    // Kaynak listeyi oku
    const repos = JSON.parse(fs.readFileSync('plugins.json', 'utf8'));
    const registry = [];

    for (const repo of repos) {
        console.log(`⏳ İşleniyor: ${repo}...`);
        try {
            // Eklentinin metadata (kobar.json) dosyasını çek
            // Not: Geliştiricilerin repolarının ana dizininde kobar.json olmalıdır
            let manifestRes = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/kobar.json`);
            
            let manifest = {};
            if (manifestRes.ok) {
                manifest = await manifestRes.json();
            } else {
                // Eğer kobar.json yoksa manifest.json deniyoruz (Geriye dönük uyumluluk)
                manifestRes = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/manifest.json`);
                if (manifestRes.ok) {
                    manifest = await manifestRes.json();
                } else {
                    console.error(`❌ HATA: ${repo} reposunda kobar.json bulunamadı! Atlanıyor...`);
                    continue;
                }
            }

            // GitHub API'den Latest Release (Son Sürüm) bilgisini çek
            const releaseRes = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
                headers: {
                    'User-Agent': 'KoBar-Registry-Bot',
                    ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
                }
            });

            let version = "0.0.0";
            let versionNote = "";

            if (releaseRes.ok) {
                const release = await releaseRes.json();
                version = release.tag_name || release.name;
                if (version.startsWith('v')) version = version.substring(1); // "v1.0.0" -> "1.0.0"
                versionNote = release.name || "Son sürüm";
            } else {
                console.warn(`⚠️ UYARI: ${repo} için GitHub Release bulunamadı.`);
            }

            // Nihai JSON objesini oluştur ve listeye ekle
            registry.push({
                id: manifest.id || repo.replace('/', '-').toLowerCase(),
                name: manifest.name || repo.split('/')[1],
                version: version,
                description: manifest.description || "",
                author: manifest.author || repo.split('/')[0],
                image: manifest.image || "",
                categories: manifest.categories || [],
                versionNote: versionNote,
                githubRepo: repo,
                languages: manifest.languages || ["en"]
            });

        } catch (error) {
            console.error(`❌ HATA: ${repo} işlenirken hata oluştu:`, error.message);
        }
    }

    // Uygulamanın okuyacağı registry.json dosyasını diske yaz
    fs.writeFileSync('registry.json', JSON.stringify(registry, null, 2));
    console.log('✅ BAŞARILI: registry.json başarıyla oluşturuldu!');
}

main();
