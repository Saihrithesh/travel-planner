const fs = require('fs');

async function getWikiImage(title) {
  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=800&format=json`);
  const data = await res.json();
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  if (pageId === "-1" || !pages[pageId].thumbnail) {
     return "https://picsum.photos/seed/placeholder/600/400";
  }
  return pages[pageId].thumbnail.source;
}

async function run() {
  const titles = [
    { id: 6, title: "World_map" },
    { id: 7, title: "Hawa_Mahal" },
    { id: 8, title: "Kerala_backwaters" },
    { id: 9, title: "Manali,_Himachal_Pradesh" },
    { id: 10, title: "Taj_Mahal" },
    { id: 11, title: "Goa" },
    { id: 12, title: "Varanasi" },
    { id: 13, title: "City_Palace,_Udaipur" },
    { id: 14, title: "Munnar" },
    { id: 15, title: "Ladakh" },
    { id: 16, title: "Andaman_Islands" },
    { id: 17, title: "Rishikesh" },
    { id: 18, title: "Hampi" },
    { id: 19, title: "Darjeeling" }
  ];

  const results = {};
  for(const item of titles) {
    results[item.id] = await getWikiImage(item.title);
  }
  
  fs.writeFileSync('wiki_images.json', JSON.stringify(results, null, 2), 'utf-8');
}

run();
