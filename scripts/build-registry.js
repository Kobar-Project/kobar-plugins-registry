const fs = require('fs');

async function main() {
    // Read the source repository list
    const repos = JSON.parse(fs.readFileSync('plugins.json', 'utf8'));
    const registry = [];

    for (const repo of repos) {
        console.log(`⏳ Processing: ${repo}...`);
        try {
            // Fetch the plugin's metadata (kobar.json)
            // Note: Developers should have kobar.json in the root of their repos
            let manifestRes = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/kobar.json`);
            
            let manifest = {};
            if (manifestRes.ok) {
                manifest = await manifestRes.json();
            } else {
                // If kobar.json is missing, try manifest.json (Backward compatibility)
                manifestRes = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/manifest.json`);
                if (manifestRes.ok) {
                    manifest = await manifestRes.json();
                } else {
                    console.error(`❌ ERROR: Metadata file not found in ${repo}! Skipping...`);
                    continue;
                }
            }

            // Fetch the Latest Release from GitHub API
            const releaseRes = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
                headers: {
                    'User-Agent': 'KoBar-Registry-Bot',
                    ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
                }
            });

            let releaseVersion = "0.0.0";
            let releaseNote = "";

            if (releaseRes.ok) {
                const release = await releaseRes.json();
                releaseVersion = release.tag_name || release.name;
                if (releaseVersion.startsWith('v')) releaseVersion = releaseVersion.substring(1); // "v1.0.0" -> "1.0.0"
                releaseNote = release.name || "Latest release";
            } else {
                console.warn(`⚠️ WARNING: GitHub Release not found for ${repo}.`);
            }

            // Create the final JSON object
            const pluginData = {
                // Default fallback values
                id: repo.replace('/', '-').toLowerCase(),
                name: repo.split('/')[1],
                author: repo.split('/')[0],
                
                // Spread all data from manifest to include custom fields like storeImage, isBeta, etc.
                ...manifest, 
                
                // Ensure githubRepo is explicitly set based on the current loop
                githubRepo: repo, 
            };

            // Override version with GitHub release tag if available
            if (releaseVersion !== "0.0.0") {
                pluginData.version = releaseVersion;
            }

            // Only use GitHub release note if manifest doesn't have a specific versionNote
            if (!manifest.versionNote && releaseNote) {
                pluginData.versionNote = releaseNote;
            }

            // Add to registry list
            registry.push(pluginData);

        } catch (error) {
            console.error(`❌ ERROR: Failed to process ${repo}:`, error.message);
        }
    }

    // Write the generated registry.json to disk
    fs.writeFileSync('registry.json', JSON.stringify(registry, null, 2));
    console.log('✅ SUCCESS: registry.json has been generated successfully!');
}

main();
