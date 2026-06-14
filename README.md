# 📰 Weekly RSS Digest

A lightweight Node.js bot that fetches your favourite RSS/Atom feeds every week
and emails you a clean digest — runs for **free** on GitHub Actions + Resend.

---

## Project structure

```
weekly-digest/
├── .github/
│   └── workflows/
│       └── weekly-digest.yml   ← GitHub Actions schedule
├── src/
│   ├── crawler.js              ← RSS fetching & filtering
│   ├── emailer.js              ← HTML email builder + Resend sender
│   └── index.js                ← Entry point
├── config.js                   ← ✏️  YOUR feeds & settings go here
└── package.json
```

---

## Setup (5 minutes)

### 1 · Get a free Resend account

1. Go to [resend.com](https://resend.com) and sign up (no credit card).
2. In the dashboard → **API Keys** → create a new key. Copy it.
3. Free tier = 3,000 emails/month — more than enough.

> **From address:**
> While testing you can use `onboarding@resend.dev` as the sender and it will
> deliver to the email you registered with.
> For a permanent setup, verify your own domain in the Resend dashboard and use
> `digest@yourdomain.com`.

---

### 2 · Configure your feeds

Edit **`config.js`**:

```js
export const config = {
  feeds: [
    { name: "My Blog", url: "https://myblog.com/feed" },
    { name: "Hacker News", url: "https://news.ycombinator.com/rss" },
    // add as many as you like
  ],
  maxItemsPerFeed: 5,
  emailFrom: "onboarding@resend.dev", // or 'digest@yourdomain.com'
  emailTo: process.env.TO_EMAIL, // set in GitHub Secrets
  emailSubject: "📰 Your Weekly Digest",
};
```

---

### 3 · Push to GitHub

```bash
git init
git add .
git commit -m "init weekly digest"
gh repo create weekly-digest --private --push   # or push to an existing repo
```

---

### 4 · Add GitHub Secrets

In your repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name      | Value                         |
| ---------------- | ----------------------------- |
| `RESEND_API_KEY` | your Resend API key           |
| `TO_EMAIL`       | the email you want to send to |

---

### 5 · Test it immediately

Go to **Actions → Weekly RSS Digest → Run workflow** and click the green button.
You should receive an email within ~30 seconds.

---

## Schedule

The workflow runs **every Monday at 08:00 UTC** by default.
Edit the cron expression in `.github/workflows/weekly-digest.yml`:

```yaml
- cron: "0 8 * * 1" # Monday 08:00 UTC
```

Use [crontab.guru](https://crontab.guru/) to build your preferred schedule.

---

## Running locally

```bash
npm install
RESEND_API_KEY=re_xxx TO_EMAIL=you@email.com node src/index.js
```

---

## Respecting robots.txt / legal crawling

This bot only reads **RSS/Atom feeds** — structured data that sites intentionally
publish for machine consumption. No HTML scraping, no aggressive polling.
Each feed is fetched once per week, well within any reasonable rate limit.

---

## Dependencies

| Package                                              | Purpose                   |
| ---------------------------------------------------- | ------------------------- |
| [`rss-parser`](https://github.com/rbren/rss-parser)  | Parse RSS & Atom feeds    |
| [`resend`](https://resend.com/docs/send-with-nodejs) | Send email via Resend API |

## services

### Zagreb info

```curl
curl --location 'https://www.infozagreb.hr/API/hr/search?menu_id=262&categories=&date_from=14.06.2026&date_to=21.06.2026&str=1&type=EVENTS&orderField=od.date_from&per_page=200' \
--header 'accept: application/json, text/plain, _/_' \
--header 'accept-language: en-US,en;q=0.9' \
--header 'dnt: 1' \
--header 'priority: u=1, i' \
--header 'referer: https://www.infozagreb.hr/' \
--header 'sec-ch-ua-mobile: ?0' \
--header 'sec-ch-ua-platform: "macOS"' \
--header 'sec-fetch-dest: empty' \
--header 'sec-fetch-mode: cors' \
--header 'sec-fetch-site: same-origin'
```

response:

```json
{
  "data": [
    {
      "id_objects": 75460,
      "id_objects_types": 22,
      "name": "Pri Muzeju",
      "link": "pri-muzeju-hr",
      "date_created": "11.05.2026 11:31:10",
      "date_created_unformatted": "2026-05-11T09:31:10.000Z",
      "date_from": "01.05.2026",
      "date_to": "30.09.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/ostala-dogadanja",
      "mainCategoryName": "Ostala događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "72159201-fff1-4e56-a368-8ff37f057645.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 117656
      },
      "locations": [
        {
          "id_objects": 182,
          "id_objects_types": 21,
          "name": "Muzej grada Zagreba",
          "link": "muzej-grada-zagreba",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "Obrađuje teme iz kulturne, umjetničke, ekonomske i političke povijesti grada od rimskih nalaza do modernog doba.",
          "pages_link": "/hr/istrazi-zagreb/kultura/muzeji",
          "mainCategoryName": "Muzeji",
          "mainCategoryId": 116,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "48038ef8-8f3f-481e-8a6f-f304bd394969.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_18:36:36",
              "data": {
                "description": ""
              }
            },
            "id_media": 56964
          }
        }
      ],
      "dates": [
        {
          "date_from": "01.05.2026.",
          "date_to": "30.09.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-04-30T22:00:00.000Z",
          "u_date_to": "2026-09-29T22:00:00.000Z",
          "formatted_date": "01.05.2026. - 30.09.2026."
        }
      ]
    },
    {
      "id_objects": 75310,
      "id_objects_types": 22,
      "name": "Pop Up By The Lake",
      "link": "pop-up-by-the-lake-hr-69e9d0244bdf3",
      "date_created": "23.04.2026 09:54:12",
      "date_created_unformatted": "2026-04-23T07:54:12.000Z",
      "date_from": "28.05.2026",
      "date_to": "28.06.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/ostala-dogadanja",
      "mainCategoryName": "Ostala događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "12ed00ad-45a6-48d7-8371-b80d2efa03bc.png",
          "extension": "png",
          "data": ""
        },
        "id_media": 117443
      },
      "locations": [
        {
          "id_objects": 1022,
          "id_objects_types": 21,
          "name": "Bundek",
          "link": "bundek",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "Park Bundek smješten je na području Novog Zagreba uz rijeku Savu.",
          "pages_link": "/hr/istrazi-zagreb/atrakcije/parkovi",
          "mainCategoryName": "Parkovi",
          "mainCategoryId": 135,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "c1343b2b-646f-41b6-9aff-f767af240b60.jpg",
              "extension": "jpg",
              "date_updated": "24.02.2026_11:35:47",
              "data": ""
            },
            "id_media": 116827
          }
        }
      ],
      "dates": [
        {
          "date_from": "28.05.2026.",
          "date_to": "28.06.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-05-27T22:00:00.000Z",
          "u_date_to": "2026-06-27T22:00:00.000Z",
          "formatted_date": "28.05.2026. - 28.06.2026."
        }
      ]
    },
    {
      "id_objects": 75627,
      "id_objects_types": 22,
      "name": "WTT Contender Zagreb 2026",
      "link": "wtt-contender-zagreb-2026",
      "date_created": "05.06.2026 13:33:35",
      "date_created_unformatted": "2026-06-05T11:33:35.000Z",
      "date_from": "09.06.2026",
      "date_to": "14.06.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/sportska-dogadanja",
      "mainCategoryName": "Sportska događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "c618b80a-edea-4095-a5e0-ed1d458351e0.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 118015
      },
      "locations": [
        {
          "id_objects": 871,
          "id_objects_types": 21,
          "name": "Arena Zagreb",
          "link": "arena-zagreb",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "Najveća sportska arena u Hrvatskoj, Arena Zagreb, sagrađena je 2008. godine.",
          "pages_link": "/hr/lifestyle/sport-i-rekreacija/sportske-dvorane-i-stadioni",
          "mainCategoryName": "Sportske dvorane i stadioni",
          "mainCategoryId": 203,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "b621e2d5-788f-4631-92a9-f6aba9aa7518.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_18:54:13",
              "data": {
                "description": ""
              }
            },
            "id_media": 59021
          }
        }
      ],
      "dates": [
        {
          "date_from": "09.06.2026.",
          "date_to": "14.06.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-06-08T22:00:00.000Z",
          "u_date_to": "2026-06-13T22:00:00.000Z",
          "formatted_date": "09.06.2026. - 14.06.2026."
        }
      ]
    },
    {
      "id_objects": 75526,
      "id_objects_types": 22,
      "name": "14. Organ vida - Happy Spiraling",
      "link": "14-organ-vida-happy-spiraling",
      "date_created": "19.05.2026 10:02:49",
      "date_created_unformatted": "2026-05-19T08:02:49.000Z",
      "date_from": "11.06.2026",
      "date_to": "06.09.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/izlozbe",
      "mainCategoryName": "Izložbe",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "8922b552-97bf-498f-9114-6501809c693b.png",
          "extension": "png",
          "data": ""
        },
        "id_media": 117782
      },
      "locations": [
        {
          "id_objects": 188,
          "id_objects_types": 21,
          "name": "Muzej suvremene umjetnosti",
          "link": "muzej-suvremene-umjetnosti",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "U zbirkama nalazi se oko 12. 000 djela suvremene umjetnosti, radova domaćih i inozemnih autora...",
          "pages_link": "/hr/istrazi-zagreb/kultura/muzeji",
          "mainCategoryName": "Muzeji",
          "mainCategoryId": 116,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "d1ca56f5-4dbc-4bb7-8647-581b3b6e08a5.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_18:36:56",
              "data": {
                "description": "muzej suvremene umjetnosti j duval"
              }
            },
            "id_media": 57007
          }
        }
      ],
      "dates": [
        {
          "date_from": "11.06.2026.",
          "date_to": "06.09.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-06-10T22:00:00.000Z",
          "u_date_to": "2026-09-05T22:00:00.000Z",
          "formatted_date": "11.06.2026. - 06.09.2026."
        }
      ]
    },
    {
      "id_objects": 75530,
      "id_objects_types": 22,
      "name": "Baš Naš Sunset",
      "link": "bas-nas-sunset-hr",
      "date_created": "19.05.2026 10:30:00",
      "date_created_unformatted": "2026-05-19T08:30:00.000Z",
      "date_from": "11.06.2026",
      "date_to": "05.07.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/ostala-dogadanja",
      "mainCategoryName": "Ostala događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "f4048634-6f23-4f2f-b5c6-861c9f461e9c.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 117786
      },
      "locations": [
        {
          "id_objects": 2500,
          "id_objects_types": 21,
          "name": "Plato Gradec",
          "link": "plato-gradec",
          "date_created": "02.03.2017 11:55:48",
          "date_created_unformatted": "2017-03-02T10:55:48.000Z",
          "heading": "",
          "pages_link": "/hr/nekategorizirani",
          "mainCategoryName": "Nekategorizirani",
          "mainCategoryId": 268,
          "media": {
            "heading_image": {
              "media_path": null,
              "filename": null,
              "extension": null,
              "date_updated": null,
              "data": null
            },
            "id_media": null
          }
        }
      ],
      "dates": [
        {
          "date_from": "11.06.2026.",
          "date_to": "05.07.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-06-10T22:00:00.000Z",
          "u_date_to": "2026-07-04T22:00:00.000Z",
          "formatted_date": "11.06.2026. - 05.07.2026."
        }
      ]
    },
    {
      "id_objects": 75603,
      "id_objects_types": 22,
      "name": "Auto Sport Adria",
      "link": "auto-sport-adria",
      "date_created": "28.05.2026 09:18:29",
      "date_created_unformatted": "2026-05-28T07:18:29.000Z",
      "date_from": "11.06.2026",
      "date_to": "14.06.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/sportska-dogadanja",
      "mainCategoryName": "Sportska događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "af367255-e4bb-46c2-8ca1-1bd3b4f3e03d.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 117892
      },
      "locations": [],
      "dates": [
        {
          "date_from": "11.06.2026.",
          "date_to": "14.06.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-06-10T22:00:00.000Z",
          "u_date_to": "2026-06-13T22:00:00.000Z",
          "formatted_date": "11.06.2026. - 14.06.2026."
        }
      ]
    },
    {
      "id_objects": 75436,
      "id_objects_types": 22,
      "name": "Art Fair Nesvrstani 9",
      "link": "art-fair-nesvrstani-9",
      "date_created": "08.05.2026 11:52:10",
      "date_created_unformatted": "2026-05-08T09:52:10.000Z",
      "date_from": "12.06.2026",
      "date_to": "14.06.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/sajmovi-i-kongresi",
      "mainCategoryName": "Sajmovi i kongresi",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "f4405360-1e95-4e4d-93ca-54d8c47e2f76.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 117630
      },
      "locations": [
        {
          "id_objects": 1041,
          "id_objects_types": 21,
          "name": "Lauba - kuća za ljude i umjetnost",
          "link": "lauba",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "LAUBA je sada mjesto iskustva, učenja, zabave i društvene interakcije.  Ona priča priču o suvremenoj umjetnosti na svoj način.",
          "pages_link": "/hr/istrazi-zagreb/kultura/galerije-i-umjetnicke-zbirke",
          "mainCategoryName": "Galerije i umjetničke zbirke",
          "mainCategoryId": 117,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "a9efc8e1-2a02-4d2d-9962-eafa2f924175.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_18:59:01",
              "data": {
                "description": ""
              }
            },
            "id_media": 59597
          }
        }
      ],
      "dates": [
        {
          "date_from": "12.06.2026.",
          "date_to": "14.06.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-06-11T22:00:00.000Z",
          "u_date_to": "2026-06-13T22:00:00.000Z",
          "formatted_date": "12.06.2026. - 14.06.2026."
        }
      ]
    },
    {
      "id_objects": 75649,
      "id_objects_types": 22,
      "name": "Green River Fest 2026",
      "link": "green-river-fest-2026",
      "date_created": "08.06.2026 11:22:53",
      "date_created_unformatted": "2026-06-08T09:22:53.000Z",
      "date_from": "12.06.2026",
      "date_to": "27.09.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": "Lokacija: Savski nasip bb (kod Hendrixovog mosta)",
      "pages_link": "/hr/dogadanja/ostala-dogadanja",
      "mainCategoryName": "Ostala događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "a2461455-6e28-48d5-86ac-b512b8c5f7f5.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 118038
      },
      "locations": [],
      "dates": [
        {
          "date_from": "12.06.2026.",
          "date_to": "27.09.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-06-11T22:00:00.000Z",
          "u_date_to": "2026-09-26T22:00:00.000Z",
          "formatted_date": "12.06.2026. - 27.09.2026."
        }
      ]
    },
    {
      "id_objects": 75434,
      "id_objects_types": 22,
      "name": "Vinski grad Zagreb 2026",
      "link": "vinski-grad-zagreb-2026-hr",
      "date_created": "08.05.2026 11:33:23",
      "date_created_unformatted": "2026-05-08T09:33:23.000Z",
      "date_from": "13.06.2026",
      "date_to": "27.06.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/ostala-dogadanja",
      "mainCategoryName": "Ostala događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "188dd655-42ec-497a-b2cd-f5efcaf4840a.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 117628
      },
      "locations": [
        {
          "id_objects": 1885,
          "id_objects_types": 21,
          "name": "Trg dr. Franje Tuđmana",
          "link": "trg-dr-franje-tudmana",
          "date_created": "03.04.2015 10:48:47",
          "date_created_unformatted": "2015-04-03T08:48:47.000Z",
          "heading": "",
          "pages_link": "/hr/nekategorizirani",
          "mainCategoryName": "Nekategorizirani",
          "mainCategoryId": 268,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "e219540b-8648-4c2e-a882-0317ace30afd.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_19:34:58",
              "data": {
                "description": ""
              }
            },
            "id_media": 64038
          }
        }
      ],
      "dates": [
        {
          "date_from": "13.06.2026.",
          "date_to": "27.06.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-06-12T22:00:00.000Z",
          "u_date_to": "2026-06-26T22:00:00.000Z",
          "formatted_date": "13.06.2026. - 27.06.2026."
        }
      ]
    },
    {
      "id_objects": 74318,
      "id_objects_types": 22,
      "name": "The Offspring",
      "link": "the-offspring-hr-690b3e66050cc",
      "date_created": "05.11.2025 13:10:50",
      "date_created_unformatted": "2025-11-05T12:10:50.000Z",
      "date_from": "14.06.2026",
      "date_to": null,
      "time_from": "00.00",
      "time_to": null,
      "heading": null,
      "pages_link": "/hr/dogadanja/koncerti-i-glazbena-dogadanja",
      "mainCategoryName": "Koncerti i glazbena događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "0a17cc93-ff5d-486b-8153-40436796efb8.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 116006
      },
      "locations": [
        {
          "id_objects": 129,
          "id_objects_types": 21,
          "name": "Zagrebački velesajam",
          "link": "zagrebacki-velesajam",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "",
          "pages_link": "/hr/planiranje-putovanja/turisticke-informacije/korisne-informacije/gospodarske-i-znanstvene-institucije",
          "mainCategoryName": "Gospodarske i znanstvene institucije",
          "mainCategoryId": 244,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "d8e12a89-bdd4-48e7-931e-ec9ee5f0c2b6.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_18:34:42",
              "data": {
                "description": "1"
              }
            },
            "id_media": 56739
          }
        }
      ],
      "dates": [
        {
          "date_from": "14.06.2026.",
          "date_to": null,
          "time_from": "00:00",
          "time_to": null,
          "u_date_from": "2026-06-13T22:00:00.000Z",
          "u_date_to": null,
          "formatted_date": "14.06.2026."
        }
      ]
    },
    {
      "id_objects": 74829,
      "id_objects_types": 22,
      "name": "Anthrax",
      "link": "anthrax-hr-69899bc4c8315",
      "date_created": "09.02.2026 09:37:15",
      "date_created_unformatted": "2026-02-09T08:37:15.000Z",
      "date_from": "15.06.2026",
      "date_to": null,
      "time_from": "20.30",
      "time_to": null,
      "heading": null,
      "pages_link": "/hr/dogadanja/koncerti-i-glazbena-dogadanja",
      "mainCategoryName": "Koncerti i glazbena događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "9e3bcdb9-167c-4c50-a445-9775e97eaee3.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 116649
      },
      "locations": [
        {
          "id_objects": 440,
          "id_objects_types": 21,
          "name": "Boogaloo Club",
          "link": "boogaloo-club",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "",
          "pages_link": "/hr/lifestyle/nocni-zivot/klubovi",
          "mainCategoryName": "Klubovi",
          "mainCategoryId": 193,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "c77ea0dc-4ad8-49fd-a938-585adfe9756b.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_18:44:44",
              "data": {
                "description": ""
              }
            },
            "id_media": 57953
          }
        }
      ],
      "dates": [
        {
          "date_from": "15.06.2026.",
          "date_to": null,
          "time_from": "20:30",
          "time_to": null,
          "u_date_from": "2026-06-15T18:30:00.000Z",
          "u_date_to": null,
          "formatted_date": "15.06.2026. 20:30h"
        }
      ]
    },
    {
      "id_objects": 74259,
      "id_objects_types": 22,
      "name": "A Perfect Circle",
      "link": "a-perfect-circle",
      "date_created": "28.10.2025 09:43:35",
      "date_created_unformatted": "2025-10-28T08:43:35.000Z",
      "date_from": "16.06.2026",
      "date_to": null,
      "time_from": "20.00",
      "time_to": null,
      "heading": null,
      "pages_link": "/hr/dogadanja/koncerti-i-glazbena-dogadanja",
      "mainCategoryName": "Koncerti i glazbena događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "61722ac5-b592-4556-9e64-5958c5aaecb5.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 115734
      },
      "locations": [
        {
          "id_objects": 353,
          "id_objects_types": 21,
          "name": "SRC Šalata",
          "link": "src-salata",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "U zimskim mjesecima nudi uživanje na klizalištu dok se u ljetnim mjesecima možete rashladiti na bazenu.",
          "pages_link": "/hr/lifestyle/sport-i-rekreacija/rekreacijski-centri",
          "mainCategoryName": "Rekreacijski centri",
          "mainCategoryId": 204,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "a1dbcf8a-5524-4326-91ce-6254759d4ddb.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_18:42:29",
              "data": {
                "description": ""
              }
            },
            "id_media": 57696
          }
        }
      ],
      "dates": [
        {
          "date_from": "16.06.2026.",
          "date_to": null,
          "time_from": "20:00",
          "time_to": null,
          "u_date_from": "2026-06-16T18:00:00.000Z",
          "u_date_to": null,
          "formatted_date": "16.06.2026. 20:00h"
        }
      ]
    },
    {
      "id_objects": 74585,
      "id_objects_types": 22,
      "name": "Sting",
      "link": "sting-hr-694288dae65af",
      "date_created": "17.12.2025 11:42:36",
      "date_created_unformatted": "2025-12-17T10:42:36.000Z",
      "date_from": "17.06.2026",
      "date_to": null,
      "time_from": "00.00",
      "time_to": null,
      "heading": null,
      "pages_link": "/hr/dogadanja/koncerti-i-glazbena-dogadanja",
      "mainCategoryName": "Koncerti i glazbena događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "c920535b-8148-49d1-9c94-45483cf374bd.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 116286
      },
      "locations": [
        {
          "id_objects": 871,
          "id_objects_types": 21,
          "name": "Arena Zagreb",
          "link": "arena-zagreb",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "Najveća sportska arena u Hrvatskoj, Arena Zagreb, sagrađena je 2008. godine.",
          "pages_link": "/hr/lifestyle/sport-i-rekreacija/sportske-dvorane-i-stadioni",
          "mainCategoryName": "Sportske dvorane i stadioni",
          "mainCategoryId": 203,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "b621e2d5-788f-4631-92a9-f6aba9aa7518.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_18:54:13",
              "data": {
                "description": ""
              }
            },
            "id_media": 59021
          }
        }
      ],
      "dates": [
        {
          "date_from": "17.06.2026.",
          "date_to": null,
          "time_from": "00:00",
          "time_to": null,
          "u_date_from": "2026-06-16T22:00:00.000Z",
          "u_date_to": null,
          "formatted_date": "17.06.2026."
        }
      ]
    },
    {
      "id_objects": 75112,
      "id_objects_types": 22,
      "name": "Zagreb Classic",
      "link": "zagreb-classic-hr-69c29e555dfd6",
      "date_created": "24.03.2026 15:24:40",
      "date_created_unformatted": "2026-03-24T14:24:40.000Z",
      "date_from": "19.06.2026",
      "date_to": "03.07.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/koncerti-i-glazbena-dogadanja",
      "mainCategoryName": "Koncerti i glazbena događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "4429a278-8d91-421b-9391-a4f036a846f2.jpg",
          "extension": "jpg",
          "data": ""
        },
        "id_media": 117983
      },
      "locations": [
        {
          "id_objects": 1671,
          "id_objects_types": 21,
          "name": "Trg kralja Tomislava",
          "link": "trg-kralja-tomislava",
          "date_created": "24.09.2014 12:53:03",
          "date_created_unformatted": "2014-09-24T10:53:03.000Z",
          "heading": "Spomenik kralju Tomislavu, prvom hrvatskom kralju nalazi se na istoimenom trgu.",
          "pages_link": "/hr/istrazi-zagreb/atrakcije/trgovi",
          "mainCategoryName": "Trgovi",
          "mainCategoryId": 181,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "c13b9129-0321-45d4-a613-9400cbf6a092.jpg",
              "extension": "jpg",
              "date_updated": "24.02.2026_10:24:19",
              "data": ""
            },
            "id_media": 116805
          }
        },
        {
          "id_objects": 1661,
          "id_objects_types": 21,
          "name": "Zrinjevac",
          "link": "zrinjevac",
          "date_created": "23.09.2014 11:19:10",
          "date_created_unformatted": "2014-09-23T09:19:10.000Z",
          "heading": "U samom središtu grada, na Zrinjevcu, jedno je od najromantičnijih zagrebačkih odredišta, zeleno i cvjetno zagrebačko šetalište i odredište ljubitelja umjetnosti.",
          "pages_link": "/hr/istrazi-zagreb/atrakcije/parkovi",
          "mainCategoryName": "Parkovi",
          "mainCategoryId": 135,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "77337776-8ed8-4e15-a4c3-31b39c65e08e.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_19:24:58",
              "data": {
                "description": ""
              }
            },
            "id_media": 62866
          }
        }
      ],
      "dates": [
        {
          "date_from": "19.06.2026.",
          "date_to": "03.07.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-06-18T22:00:00.000Z",
          "u_date_to": "2026-07-02T22:00:00.000Z",
          "formatted_date": "19.06.2026. - 03.07.2026."
        }
      ]
    },
    {
      "id_objects": 75472,
      "id_objects_types": 22,
      "name": "Bahrami Plays Bach",
      "link": "bahrami-plays-bach",
      "date_created": "12.05.2026 15:14:14",
      "date_created_unformatted": "2026-05-12T13:14:14.000Z",
      "date_from": "19.06.2026",
      "date_to": null,
      "time_from": "21.00",
      "time_to": null,
      "heading": "Zagrebačka filharmonija; Ramin Bahrami, klavir; Dawid Runtz, dirigent\n",
      "pages_link": "/hr/dogadanja/zagreb-classic",
      "mainCategoryName": "Zagreb Classic",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "ba9c1bca-3c6a-4f1e-befa-2bcce4a10247.png",
          "extension": "png",
          "data": ""
        },
        "id_media": 117942
      },
      "locations": [
        {
          "id_objects": 1671,
          "id_objects_types": 21,
          "name": "Trg kralja Tomislava",
          "link": "trg-kralja-tomislava",
          "date_created": "24.09.2014 12:53:03",
          "date_created_unformatted": "2014-09-24T10:53:03.000Z",
          "heading": "Spomenik kralju Tomislavu, prvom hrvatskom kralju nalazi se na istoimenom trgu.",
          "pages_link": "/hr/istrazi-zagreb/atrakcije/trgovi",
          "mainCategoryName": "Trgovi",
          "mainCategoryId": 181,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "c13b9129-0321-45d4-a613-9400cbf6a092.jpg",
              "extension": "jpg",
              "date_updated": "24.02.2026_10:24:19",
              "data": ""
            },
            "id_media": 116805
          }
        }
      ],
      "dates": [
        {
          "date_from": "19.06.2026.",
          "date_to": null,
          "time_from": "21:00",
          "time_to": null,
          "u_date_from": "2026-06-19T19:00:00.000Z",
          "u_date_to": null,
          "formatted_date": "19.06.2026. 21:00h"
        }
      ]
    },
    {
      "id_objects": 75492,
      "id_objects_types": 22,
      "name": "Ljeto u MSU 2026.",
      "link": "ljeto-u-msu-202",
      "date_created": "15.05.2026 10:43:11",
      "date_created_unformatted": "2026-05-15T08:43:11.000Z",
      "date_from": "20.06.2026",
      "date_to": "17.07.2026",
      "time_from": "00.00",
      "time_to": "00.00",
      "heading": null,
      "pages_link": "/hr/dogadanja/koncerti-i-glazbena-dogadanja",
      "mainCategoryName": "Koncerti i glazbena događanja",
      "media": {
        "heading_image": {
          "media_path": "/media/22",
          "filename": "fcd738c1-d5f0-4800-999b-dca8c408385b.png",
          "extension": "png",
          "data": ""
        },
        "id_media": 117741
      },
      "locations": [
        {
          "id_objects": 188,
          "id_objects_types": 21,
          "name": "Muzej suvremene umjetnosti",
          "link": "muzej-suvremene-umjetnosti",
          "date_created": "24.07.2014 16:58:19",
          "date_created_unformatted": "2014-07-24T14:58:19.000Z",
          "heading": "U zbirkama nalazi se oko 12. 000 djela suvremene umjetnosti, radova domaćih i inozemnih autora...",
          "pages_link": "/hr/istrazi-zagreb/kultura/muzeji",
          "mainCategoryName": "Muzeji",
          "mainCategoryId": 116,
          "media": {
            "heading_image": {
              "media_path": "/media/21",
              "filename": "d1ca56f5-4dbc-4bb7-8647-581b3b6e08a5.jpg",
              "extension": "jpg",
              "date_updated": "26.07.2023_18:36:56",
              "data": {
                "description": "muzej suvremene umjetnosti j duval"
              }
            },
            "id_media": 57007
          }
        }
      ],
      "dates": [
        {
          "date_from": "20.06.2026.",
          "date_to": "17.07.2026.",
          "time_from": "00:00",
          "time_to": "00:00",
          "u_date_from": "2026-06-19T22:00:00.000Z",
          "u_date_to": "2026-07-16T22:00:00.000Z",
          "formatted_date": "20.06.2026. - 17.07.2026."
        }
      ]
    }
  ],
  "total_pages": 1,
  "page": 1,
  "items_per_page": 200,
  "timeTaken": {
    "query1": "36.81ms",
    "query2": "33.32ms"
  },
  "timestamp": 1781424635792,
  "number_of_results": 16
}
```
