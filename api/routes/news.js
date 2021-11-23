/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express')
var fetch = require('node-fetch')
const NodeCache = require( "node-cache" );
var {generateUrlParams, generateSlugFromTitle, generateUUID, parseUUID} = require('../utils/index')
var router = express.Router()

// free news api limits the number of requests per hour
// to solve this, simple node caching library is implemented
// cache will be kept until app is restarted
const newsCache = new NodeCache({
    stdTTL: 0,
    checkperiod: 0,

});

const URL_BASE = 'https://newsapi.org/v2/'

const stubData = {
    status: 'ok',
    totalResults: 8065,
    articles: [
        {
            source: {
                id: 'the-verge',
                name: 'The Verge'
            },
            author: 'Richard Lawler',
            title: 'A fake press release claiming Kroger accepts crypto reached the retailer’s own webpage',
            description:
                'A crypto hoax claimed Kroger is accepting Bitcoin Cash. The fake press release was similar to one targeting Walmart earlier this year. The retailer quickly confirmed it’s fake, but not before the cryptocurrency’s price spiked by $30.',
            url: 'https://www.theverge.com/2021/11/5/22765098/kroger-bitcoin-cash-cryptocurrency-hoax-pump-dump',
            urlToImage:
                'https://cdn.vox-cdn.com/thumbor/CKp0YjnwF88--mWg1kfPmspvfzY=/0x358:5000x2976/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/22988084/1234440443.jpg',
            publishedAt: '2021-11-05T13:32:14Z',
            content:
                'A similar hoax earlier this year tied Walmart to Litecoin\r\nIf you buy something from a Verge link, Vox Media may earn a commission. See our ethics statement.\r\nPhoto Illustration by Thiago Prudencio/S… [+1900 chars]'
        },
        {
            source: {
                id: null,
                name: 'Gizmodo.com'
            },
            author: 'Molly Taft',
            title: 'Bitcoin Miners Are Gobbling Up U.S. Energy',
            description:
                'There’s a big new presence slurping up power from the U.S. grid, and it’s growing: bitcoin miners. New research shows that the U.S. has overtaken China as the top global destination for bitcoin mining and energy use is skyrocketing as a result.Read more...',
            url: 'https://gizmodo.com/bitcoin-miners-are-gobbling-up-u-s-energy-1847956270',
            urlToImage:
                'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/2a0e7e1f6d07e6cb21b75677aa6df5f0.jpg',
            publishedAt: '2021-10-28T16:45:00Z',
            content:
                'Theres a big new presence slurping up power from the U.S. grid, and its growing: bitcoin miners. New research shows that the U.S. has overtaken China as the top global destination for bitcoin mining … [+3088 chars]'
        },
        {
            source: {
                id: null,
                name: 'Gizmodo.com'
            },
            author: 'Tom McKay',
            title: 'Roughly One-Third of Bitcoin Is Controlled by a Small Cabal of Whales, According to New Study',
            description:
                'For all the talk of democratizing finance, the vast majority of Bitcoin continues to be owned by a relative handful of investors.Read more...',
            url: 'https://gizmodo.com/roughly-one-third-of-bitcoin-is-controlled-by-a-small-c-1847938047',
            urlToImage:
                'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/c5ef49718a8e4104ec3c1c55507c8244.jpg',
            publishedAt: '2021-10-26T18:10:00Z',
            content:
                'For all the talk of democratizing finance, the vast majority of Bitcoin continues to be owned by a relative handful of investors.\r\nAs flagged by Bloomberg, newly released data by the National Bureau … [+4274 chars]'
        },
        {
            source: {
                id: null,
                name: 'Entrepreneur'
            },
            author: 'Entrepreneur Staff',
            title: 'AMC Begins Accepting Crypto',
            description: 'Bitcoin, Ethereum, Bitcoin Cash and Litecoin are accepted.',
            url: 'https://www.entrepreneur.com/article/396981',
            urlToImage: 'https://assets.entrepreneur.com/content/3x2/2000/1636738243-GettyImages-1307671673.jpg',
            publishedAt: '2021-11-12T17:31:23Z',
            content:
                'In keeping with a previous announcement, AMC theaters now accept cryptocurrencies as payment for online purchases. \r\nBitcoin, Ethereum, Bitcoin Cash and Litecoin are accepted. \r\nPreviously, the compa… [+1036 chars]'
        },
        {
            source: {
                id: 'reuters',
                name: 'Reuters'
            },
            author: null,
            title: 'Explainer: What we know so far about El Salvador\'s volcano-powered bitcoin bond - Reuters',
            description:
                'El Salvador plans to build the world\'s first <a href="https://www.reuters.com/markets/rates-bonds/el-salvador-plans-first-bitcoin-city-backed-by-bitcoin-bonds-2021-11-21" target="_blank">"Bitcoin City"</a> with money from a $1 billion bitcoin-backed bond the …',
            url:
                'https://www.reuters.com/markets/us/what-we-know-so-far-about-el-salvadors-volcano-powered-bitcoin-bond-2021-11-22/',
            urlToImage: 'https://www.reuters.com/pf/resources/images/reuters/reuters-default.png?d=59',
            publishedAt: '2021-11-22T23:35:00Z',
            content:
                'MIZATA, El Salvador/LONDON, Nov 22 (Reuters) - El Salvador plans to build the world\'s first "Bitcoin City" with money from a $1 billion bitcoin-backed bond the country\'s President Nayib Bukele said o… [+3147 chars]'
        },
        {
            source: {
                id: 'reuters',
                name: 'Reuters'
            },
            author: 'Reuters Editorial',
            title: 'El Salvador plans \'Bitcoin City\' - Reuters',
            description:
                'After becoming the first country to accept the cryptocurrency as legal tender, El Salvador plans to build the world\'s first Bitcoin City, funded initially by bitcoin-backed bonds.',
            url: 'https://www.reuters.com/video/watch/idPEH4?now=true',
            urlToImage:
                'https://ajo.prod.reuters.tv/api/v2/img/619b824be4b085d396fd1eb4-1637581387726?location=LANDSCAPE',
            publishedAt: '2021-11-22T12:01:51Z',
            content:
                "Posted \r\nAfter becoming the first country to accept the cryptocurrency as legal tender, El Salvador plans to build the world's first Bitcoin City, funded initially by bitcoin-backed bonds."
        },
        {
            source: {
                id: 'business-insider',
                name: 'Business Insider'
            },
            author: 'insider@insider.com (Carla Mozée)',
            title: 'SEC punts on approving a spot bitcoin ETF again, pushing decision on Valkyrie\'s fund to 2022',
            description:
                'While investors wait for word on a spot bitcoin ETF, the SEC has let bitcoin futures ETFs launch.',
            url:
                'https://markets.businessinsider.com/news/currencies/spot-bitcoin-etf-sec-decision-delay-valkyrie-fund-cryptocurrency-gensler-2021-11',
            urlToImage: 'https://images2.markets.businessinsider.com/60fb0c8f0729770012b9a811?format=jpeg',
            publishedAt: '2021-11-02T13:39:41Z',
            content:
                "Bitcoin artwork displayed at the Bitcoin 2021 convention.\r\nMarco Bello/Getty Images\r\nThe Securities and Exchange Commission will not make a decision on alternative asset management firm Valkyrie's pr… [+1492 chars]"
        },
        {
            source: {
                id: 'business-insider',
                name: 'Business Insider'
            },
            author: 'mfox@businessinsider.com (Matthew Fox)',
            title:
                'An ethereum futures ETF will be available before one that holds bitcoin directly - and approval could come in the 1st quarter of 2022, Bloomberg analysts say',
            description:
                '"Though a spot Bitcoin ETF is possible in 2022, SEC approval may take longer due to concerns about regulation in the underlying bitcoin market."',
            url:
                'https://markets.businessinsider.com/news/currencies/ethereum-futures-etf-available-before-bitcoin-spot-fund-crypto-btc-2021-11',
            urlToImage: 'https://images2.markets.businessinsider.com/612f799b9ef1e50018f91d2d?format=jpeg',
            publishedAt: '2021-11-06T12:15:00Z',
            content:
                'Ether.\r\nNurPhoto\r\n<ul><li>The approval of a bitcoin futures-based ETF means a similar offering for ether is imminent.</li><li>Bloomberg analysts believe the first ether futures-based ETF could launch… [+1931 chars]'
        },
        {
            source: {
                id: null,
                name: 'Entrepreneur'
            },
            author: 'Entrepreneur Staff',
            title: 'Bitcoin Trades 7% Higher',
            description: 'Bitcoin was trading over 7% higher on Monday morning, priced around $66,105 per coin.',
            url: 'https://www.entrepreneur.com/article/395938',
            urlToImage: 'https://assets.entrepreneur.com/content/3x2/2000/1636387582-GettyImages-1297465792.jpg',
            publishedAt: '2021-11-08T16:07:45Z',
            content:
                'Bitcoin was trading over 7% higher on Monday morning, priced around $66,105 per coin.\r\nEther, was trading over 3% higher, priced at $4,722.\r\nDogecoin, meanwhile, was up over 9%, trading at a little o… [+756 chars]'
        },
        {
            source: {
                id: null,
                name: 'The Guardian'
            },
            author: 'Mike Hytner',
            title: 'Australian Baseball League club Perth Heat to pay players in bitcoin',
            description:
                'The Heat says it is the first professional sports club in the world to ‘fully embrace’ bitcoin after partnering with a cryptocurrency payment companyAustralian Baseball League club Perth Heat will pay its players in bitcoin, after partnering with a cryptocurr…',
            url:
                'https://amp.theguardian.com/sport/2021/nov/17/australian-baseball-league-club-perth-heat-to-pay-players-in-bitcoin',
            urlToImage:
                'https://i.guim.co.uk/img/media/34e3ed2699bf8595b095286f0ac929a9b2a91f64/0_58_3500_2101/master/3500.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=5b157b0539a05b70750b49b8357e894b',
            publishedAt: '2021-11-17T07:00:46Z',
            content:
                'Australian Baseball League club Perth Heat will pay its players in bitcoin, after partnering with a cryptocurrency payment company in a deal it claims to be a world first for professional sport.\r\nHea… [+2695 chars]'
        },
        {
            source: {
                id: 'engadget',
                name: 'Engadget'
            },
            author: 'Mat Smith',
            title: 'The Morning After: Adele has the power to remove the shuffle button',
            description:
                'Spotify has removed the shuffle button from all album pages after Adele pressed the company for the change in time for the launch of her album 30. According to her own tweet\r\n, albums should be listened to "as [artists] intended" as they tell "a story." If yo…',
            url:
                'https://www.engadget.com/the-morning-after-adele-has-the-power-to-remove-the-shuffle-button-121513705.html',
            urlToImage: 'https://s.yimg.com/os/creatr-uploaded-images/2021-11/e65e8590-45ee-11ec-b17f-4761a0a5b5ac',
            publishedAt: '2021-11-22T12:15:13Z',
            content:
                'Spotify has removed the shuffle button from all album pages after Adele pressed the company for the change in time for the launch of her album 30. According to her own tweet\r\n, albums should be liste… [+3186 chars]'
        },
        {
            source: {
                id: 'reuters',
                name: 'Reuters'
            },
            author: 'Tom Westbrook, Gertrude Chavez-Dreyfuss',
            title: 'UPDATE 3-Bitcoin, ether hit all-time highs as momentum accelerates - Reuters',
            description: 'UPDATE 3-Bitcoin, ether hit all-time highs as momentum accelerates  Reuters',
            url: 'https://www.reuters.com/article/fintech-cryptocurrencies-idUSL1N2S017V',
            urlToImage: 'https://s1.reutersmedia.net/resources_v2/images/rcom-default.png?w=800',
            publishedAt: '2021-11-09T15:39:00Z',
            content:
                '* Bitcoin breaks past $68,000; Ether nears $5k\r\n* Both pull back later\r\n* CoinGecko puts crypto market cap at more than $3 trillion\r\n* Flows surge as momentum runs hot (Adds new comment, updates pric… [+3162 chars]'
        },
        {
            source: {
                id: 'reuters',
                name: 'Reuters'
            },
            author: null,
            title: 'Bitcoin falls back below $60000 for first time since Nov 1 - Reuters',
            description:
                'Bitcoin fell below $60,000 for first time since Nov. 1 on Tuesday, while the cryptocurrency ether also dropped sharply.',
            url:
                'https://www.reuters.com/business/finance/bitcoin-falls-back-below-60000-first-time-since-nov-1-2021-11-16/',
            urlToImage:
                'https://www.reuters.com/resizer/9mqfV1phfYALJKRfvSG8QXV1mKE=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/4VAKH6AIP5L5RE5WKUVLG44PWY.jpg',
            publishedAt: '2021-11-16T10:26:00Z',
            content:
                'Representations of the virtual currency Bitcoin stand on a motherboard in this picture illustration taken May 20, 2021. REUTERS/Dado Ruvic/File PhotoLONDON, Nov 16 (Reuters) - Bitcoin fell below $60,… [+629 chars]'
        },
        {
            source: {
                id: null,
                name: 'Entrepreneur'
            },
            author: 'Entrepreneur Staff',
            title: 'Bitcoin Falls Amid Chinese Mining Crackdown',
            description:
                'On Tuesday, China\'s National Development and Reform Commission spokesperson Meng Wei said bitcoin mining is dangerous.',
            url: 'https://www.entrepreneur.com/article/397488',
            urlToImage: 'https://assets.entrepreneur.com/content/3x2/2000/1637082707-shutterstock-737946514.jpg',
            publishedAt: '2021-11-16T17:12:00Z',
            content:
                'Bitcoin has fallen amid Chinas ongoing crackdown on crypto mining.\r\nOn Tuesday, Chinas National Development and Reform Commission spokesperson Meng Wei said bitcoin mining is dangerous, consumes lots… [+1005 chars]'
        },
        {
            source: {
                id: null,
                name: 'Boing Boing'
            },
            author: 'Annie Rauwerda',
            title: 'Walmart sells Bitcoin now',
            description:
                'A decade ago, Bitcoin communities were small crowds of particularly techy, alternative, or keen on privacy— the oddball decentralized currency was just a few years old. Now, the masses can get cryptocurrency from the grocery store. Over 200 Coinstar ATMs in W…',
            url: 'https://boingboing.net/2021/10/23/walmart-sells-bitcoin-now.html',
            urlToImage:
                'https://i2.wp.com/boingboing.net/wp-content/uploads/2021/10/14010432313_4d8632d3d2_k.jpg?fit=1200%2C643&ssl=1',
            publishedAt: '2021-10-24T01:29:22Z',
            content:
                'A decade ago, Bitcoin communities were small crowds of particularly techy, alternative, or keen on privacy the oddball decentralized currency was just a few years old. Now, the masses can get cryptoc… [+871 chars]'
        },
        {
            source: {
                id: null,
                name: 'The Guardian'
            },
            author: 'Katharine Gammon',
            title: 'Environmentalists sound alarm at US politicians’ embrace of cryptocurrency',
            description:
                'Bitcoin and similar blockchain-based currencies require huge amounts of power, predominantly generated from fossil fuelsThe incoming mayor of New York City thinks cryptocurrency and blockchain technology are the future. Eric Adams has advocated to reshape the…',
            url:
                'https://amp.theguardian.com/technology/2021/nov/18/cryptocurrency-bitcoin-environmentalist-alarm-us-politicians',
            urlToImage:
                'https://i.guim.co.uk/img/media/86cfc8d564426a99cf271113fe4e6fbaf8964d1f/0_161_4847_2910/master/4847.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=07d06e688a97ec067ec6dd191d8c94bc',
            publishedAt: '2021-11-18T07:00:05Z',
            content:
                'The incoming mayor of New York City thinks cryptocurrency and blockchain technology are the future. Eric Adams has advocated to reshape the city into a crypto hotspot, with crypto being taught in sch… [+5815 chars]'
        },
        {
            source: {
                id: 'reuters',
                name: 'Reuters'
            },
            author: 'Reuters Staff',
            title: 'Baseball-Perth Heat to pay players and staff in Bitcoin - Reuters',
            description:
                'Perth Heat, one of the most successful Australian Baseball League sides, entered the cryptocurrency market by saying on Wednesday that they would pay players and staff in bitcoin, adding they were the first team to do so in the world.',
            url: 'https://www.reuters.com/article/baseball-perth-idUSL8N2S834U',
            urlToImage: 'https://s1.reutersmedia.net/resources_v2/images/rcom-default.png?w=800',
            publishedAt: '2021-11-17T11:48:00Z',
            content:
                'By Reuters Staff\r\nNov 17 (Reuters) - Perth Heat, one of the most successful Australian Baseball League sides, entered the cryptocurrency market by saying on Wednesday that they would pay players and … [+1484 chars]'
        },
        {
            source: {
                id: 'business-insider',
                name: 'Business Insider'
            },
            author: 'cshumba@insider.com (Camomile Shumba)',
            title:
                'VanEck’s bitcoin futures ETF will launch on Tuesday - after the SEC rejected the company’s spot ETF application',
            description:
                'Asset manager VanEck\'s bitcoin-futures exchange traded fund (ETF) will start trading on Tuesday, Cboe said in a notification.',
            url:
                'https://markets.businessinsider.com/news/currencies/vanecks-bitcoin-futures-etf-tuesday-sec-spot-ethereum-proshares-valkyrie-2021-11',
            urlToImage: 'https://images2.markets.businessinsider.com/6192581ad672280019244e84?format=jpeg',
            publishedAt: '2021-11-15T14:18:33Z',
            content:
                "Blue bitcoin\r\nYuichiro Chino\r\nAsset manager VanEck's bitcoin futures exchange traded fund (ETF) will start trading Tuesday, the Chicago Board Options Exchange (Cboe) said in a notification.\r\nLast mon… [+1918 chars]"
        },
        {
            source: {
                id: 'reuters',
                name: 'Reuters'
            },
            author: 'Reuters Editorial',
            title: 'U..S bitcoin ETF debuts but legal hurdles remain - Reuters',
            description:
                'The first U.S. bitcoin futures-based exchange traded fund began trading this week. We look at what this means for the cryptocurrency industry.',
            url: 'https://www.reuters.com/video/watch/idRCV00AD5Q',
            urlToImage: 'https://static.reuters.com/resources/r/?d=20211022&i=RCV00AD5Q&r=RCV00AD5Q&t=2',
            publishedAt: '2021-10-22T14:45:24Z',
            content:
                'Posted \r\nThe first U.S. bitcoin futures-based exchange traded fund began trading this week. We look at what this means for the cryptocurrency industry.'
        },
        {
            source: {
                id: 'reuters',
                name: 'Reuters'
            },
            author: null,
            title: 'Bitcoin hits new record as crypto market cap exceeds $3 tln - Reuters',
            description:
                'Bitcoin and ether made record peaks in the Asia session on Tuesday as enthusiasm for cryptocurrency adoption and fears about inflation leant support to the asset class.',
            url:
                'https://www.reuters.com/technology/bitcoin-hits-new-record-crypto-market-cap-exceeds-3-tln-2021-11-08/',
            urlToImage:
                'https://www.reuters.com/resizer/InHvCiSZm4U-VU8bDnCg_6ScF8s=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/UGHMBKNQAJIUNAN7OCRGXCKYOM.jpg',
            publishedAt: '2021-11-08T23:38:00Z',
            content:
                'A representation of the virtual cryptocurrency Ethereum is seen among representations of other cryptocurrencies in this picture illustration taken June 14, 2021. REUTERS/Edgar Su/IllustrationSYDNEY, … [+660 chars]'
        }
    ]
}

const defaultRequestConfig = {
	method: 'GET',
	headers: {
		'x-api-key': process.env.NEWS_API_KEY,
	},
}

const fetchNewsData = (url, params = {}) => {
	const hasParams = !!Object.keys(params).length
	const paramString = hasParams ? `?${generateUrlParams(params)}` : ''
	return fetch(`${URL_BASE}${url}${paramString}`, defaultRequestConfig)
}

const transformArticle = (category) => ({url, title, urlToImage, ...rest}) => {
		const id = generateUUID(url)
		const slug = generateSlugFromTitle(title) + '-' + id
		return {...rest, slug, title, id, category, urlToImage: urlToImage || 'https://picsum.photos/600/400'}
	}

router.get('/', async function (req, res) {
	res.redirect('/news/top')
})

router.get('/all', async function (req, res) {
	const category = req.query.q || 'general'

    const requestQueryParams = {
        q: category,
        ...req.query,
    }

    cachedQuery = newsCache.get(req.url);

    if ( cachedQuery !== undefined ){
        console.log("Request served from cache!");
        res.send(cachedQuery)
        return
    } else {
        console.log("Current cache: ", newsCache.keys());
    }

	const response = await fetchNewsData('everything', {
		...{...req.query, q: category}, // api requires some form of search narrowing
	})
	const data = await response.json()

	// const data = stubData

	if (data.status === 'error') {
		console.log(data.message);
		res.status(500).send({error: data.message})
		return
	}

	enrichedData = {
		...data,
		totalResults: Math.min(100, data?.totalResults),
		articles: (data.articles || []).map(transformArticle(category)),
	}

    // set cache
    newsCache.set(req.url, enrichedData );
	res.send(enrichedData)
})

router.get('/article', async function (req, res) {
	const id = parseUUID(req.query.slug)

    cacheKeys = newsCache.keys();

    // merge articles
    const allArticles = cacheKeys.reduce((acc, key) => {
        cachedQuery = newsCache.get(key);
        return [...acc, ...cachedQuery.articles]
    }, [])

    const article = allArticles.find(article => article.id === id)

    if (!article) {
        res.status(404).send({error: 'Cannot find article ' + id})
        return
    }

    res.send(article)
})

router.use(function (req, res) {
	res.status(404).send({error: 'Unable to find ' + req.originalUrl})
})

module.exports = router
