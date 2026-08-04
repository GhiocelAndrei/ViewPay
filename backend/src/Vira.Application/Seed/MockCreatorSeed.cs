using Vira.Abstractions.Common;
using Vira.Abstractions.Models.Creators;
using Vira.Application.Interfaces;

namespace Vira.Application.Seed;

/// <summary>
/// Builds 50 mocked Romanian creators (5 per category) at construction: real-ish handles with
/// synthesized-but-plausible clip metrics and intake questionnaires. Numbers are seeded off a
/// fixed value + category + index, so they're stable across runs (the Guids are not — that's why
/// callers key by id discovered from <see cref="All"/>, never by a hardcoded Guid).
/// </summary>
public sealed class MockCreatorSeed : IMockCreatorSeed
{
    private const int Seed = 20260804;
    private readonly List<CreatorSeedRecord> _records = [];
    private readonly Dictionary<Guid, CreatorSeedRecord> _byId = [];

    public MockCreatorSeed()
    {
        foreach (var (category, roster) in Roster)
        {
            for (var index = 0; index < roster.Length; index++)
            {
                var (displayName, handle, followers) = roster[index];
                var rng = new Random(Seed + (int)category * 5 + index);
                var record = BuildRecord(category, displayName, handle, followers, index, rng);
                _records.Add(record);
                _byId[record.Creator.Id] = record;
            }
        }
    }

    public IReadOnlyList<CreatorSeedRecord> All => _records;

    public CreatorSeedRecord? ById(Guid id) => _byId.GetValueOrDefault(id);

    public IEnumerable<CreatorSeedRecord> ByCategory(CreatorCategory category) =>
        _records.Where(r => r.Category == category);

    private static CreatorSeedRecord BuildRecord(
        CreatorCategory category, string displayName, string handle, long followers, int index, Random rng)
    {
        var (city, county) = Pick(rng, Cities);
        var creator = new Creator
        {
            AccountId = Guid.NewGuid(),
            DisplayName = displayName,
            FollowerCount = followers,
            Niche = category.ToString(),
            City = city,
            County = county
        };

        var clips = BuildClips(creator.Id, category, handle, followers, rng);
        var questionnaire = BuildQuestionnaire(creator.Id, category, index, rng);
        return new CreatorSeedRecord(creator, category, clips, questionnaire);
    }

    private static List<CreatorClip> BuildClips(
        Guid creatorId, CreatorCategory category, string handle, long followers, Random rng)
    {
        var titles = ClipTitles[category];
        // Typical clip pulls a fraction of the follower base; each clip varies around that.
        var baseViews = (long)(followers * (0.20 + rng.NextDouble() * 0.55));

        var clips = new List<CreatorClip>(10);
        for (var i = 0; i < 10; i++)
        {
            var views = Math.Max(500, (long)(baseViews * (0.5 + rng.NextDouble() * 1.3)));
            var likes = (long)(views * (0.03 + rng.NextDouble() * 0.09));   // 3–12% of views
            var comments = (long)(likes * (0.01 + rng.NextDouble() * 0.04));
            var shares = (long)(likes * (0.02 + rng.NextDouble() * 0.06));
            var videoId = 7_000_000_000_000_000_000L + rng.NextInt64(0, 999_999_999_999_999_999L);

            clips.Add(new CreatorClip
            {
                CreatorId = creatorId,
                TikTokVideoId = videoId.ToString(),
                Title = titles[(i + rng.Next(titles.Length)) % titles.Length],
                CoverImageUrl = $"https://picsum.photos/seed/{videoId}/320/568",
                EmbedLink = $"https://www.tiktok.com/@{handle}/video/{videoId}",
                ViewCount = views,
                LikeCount = likes,
                CommentCount = comments,
                ShareCount = shares,
                TikTokCreateTime = DateTimeOffset.UtcNow.AddDays(-rng.Next(1, 90)).AddHours(-rng.Next(0, 24))
            });
        }
        return clips;
    }

    private static CreatorQuestionnaire BuildQuestionnaire(
        Guid creatorId, CreatorCategory category, int index, Random rng)
    {
        var adjacent = (CreatorCategory)(((int)category + 1) % 10);
        var excluded = (CreatorCategory)(((int)category + 5) % 10);

        return new CreatorQuestionnaire
        {
            CreatorId = creatorId,
            PreferredCategories = [category, adjacent],
            ExcludedCategories = [excluded],
            AcceptsShippedProducts = rng.NextDouble() < 0.85,
            CanPurchaseProducts = rng.NextDouble() < 0.5,
            TravelWillingness = Pick(rng, TravelTiers),
            Goals = SampleSome(rng, Goals, 2),
            Values = SampleSome(rng, Values, 2),
            PreferredFormats = SampleSome(rng, Formats, 2),
            ContentLanguages = rng.NextDouble() < 0.6 ? ["ro", "en"] : ["ro"],
            ExcludedBrands = rng.NextDouble() < 0.4 ? [Pick(rng, ExcludedBrandPool)] : [],
            AllowsAlcohol = rng.NextDouble() < 0.35,
            AllowsGambling = rng.NextDouble() < 0.10,
            AllowsPolitical = rng.NextDouble() < 0.05,
            CollabCapacityPerMonth = rng.Next(1, 9),
            SelfDescribedAudience = AudienceByCategory[category],
            PriorSponsorships = BuildPriorSponsorships(category, rng)
        };
    }

    private static List<PriorSponsorship> BuildPriorSponsorships(CreatorCategory category, Random rng)
    {
        var count = rng.Next(0, 4);
        var list = new List<PriorSponsorship>(count);
        for (var i = 0; i < count; i++)
            list.Add(new PriorSponsorship { BrandName = Pick(rng, BrandPool), Category = category });
        return list;
    }

    private static List<string> SampleSome(Random rng, string[] pool, int count)
    {
        var copy = pool.ToList();
        var chosen = new List<string>(count);
        for (var i = 0; i < count && copy.Count > 0; i++)
        {
            var idx = rng.Next(copy.Count);
            chosen.Add(copy[idx]);
            copy.RemoveAt(idx);
        }
        return chosen;
    }

    private static T Pick<T>(Random rng, IReadOnlyList<T> items) => items[rng.Next(items.Count)];

    // ── Data pools ───────────────────────────────────────────────────────────────────────────

    private static readonly (string City, string County)[] Cities =
    [
        // București is county-level and split into 6 sectors — each is its own "city" value.
        ("Sector 1", "București"),
        ("Sector 2", "București"),
        ("Sector 3", "București"),
        ("Sector 4", "București"),
        ("Sector 5", "București"),
        ("Sector 6", "București"),
        ("Cluj-Napoca", "Cluj"),
        ("Timișoara", "Timiș"),
        ("Iași", "Iași"),
        ("Constanța", "Constanța"),
        ("Brașov", "Brașov"),
        ("Craiova", "Dolj"),
        ("Oradea", "Bihor"),
        ("Sibiu", "Sibiu"),
        ("Ploiești", "Prahova")
    ];

    private static readonly TravelWillingness[] TravelTiers =
    [
        TravelWillingness.None, TravelWillingness.SameCounty,
        TravelWillingness.Nationwide, TravelWillingness.OutOfCountry
    ];

    // 5 real-ish Romanian handles per category with plausible follower counts.
    private static readonly IReadOnlyDictionary<CreatorCategory, (string Name, string Handle, long Followers)[]> Roster =
        new Dictionary<CreatorCategory, (string, string, long)[]>
        {
            [CreatorCategory.Food] =
            [
                ("Jamila Cuisine", "jamilacuisine", 1_900_000),
                ("Gina Bradea", "poftabuna.gina", 1_200_000),
                ("Chef Foa", "cheffoa", 410_000),
                ("Adrian Hădean", "adrianhadean", 300_000),
                ("Cătălin Petrescu", "chefcatalinpetrescu", 180_000)
            ],
            [CreatorCategory.Sport] =
            [
                ("Andrei Deiu", "andreideiu_", 900_000),
                ("Alexia Țăran", "alexia.fit", 210_000),
                ("Robert Toma", "robert.workout", 120_000),
                ("Diana Stejaru", "diana.trains", 85_000),
                ("Cristi Marin", "cristi.gym", 60_000)
            ],
            [CreatorCategory.Tech] =
            [
                ("George Buhnici", "buhnici", 520_000),
                ("Radu Dumitru", "nwradu", 140_000),
                ("Andrei Pavel", "andrei.tech", 110_000),
                ("Ioana Vasile", "ioana.gadgets", 95_000),
                ("Mihai Ene", "techrapid", 70_000)
            ],
            [CreatorCategory.Beauty] =
            [
                ("Adelina Pestrițu", "adelina.pestritu", 1_800_000),
                ("Bianca Drăgușanu", "biancadragusanu", 700_000),
                ("Ana Morodan", "anamorodan", 610_000),
                ("Ioana Grama", "ioanagrama", 550_000),
                ("Cristina Ich", "cristinaich", 480_000)
            ],
            [CreatorCategory.Travel] =
            [
                ("Marian Cozma", "mariancozma", 160_000),
                ("Cătălin Onț", "catalin.explore", 130_000),
                ("Andrei Roșu", "andrei.travels", 90_000),
                ("Laura Voicu", "laura.wanders", 75_000),
                ("Ruxandra Ilie", "ruxi.wanderlust", 55_000)
            ],
            [CreatorCategory.Comedy] =
            [
                ("Dorian Popa", "dorianpopa", 1_500_000),
                ("Andrei Ungureanu", "omulcutourette", 800_000),
                ("Theo Zeciu", "theozeciu", 650_000),
                ("Micutzu", "micutzu", 400_000),
                ("Vio", "vio.comedy", 220_000)
            ],
            [CreatorCategory.Education] =
            [
                ("Sorin Mihai", "profu.de.mate", 310_000),
                ("Radu Constantin", "radu.explica", 140_000),
                ("Mihai Predescu", "mihai.educatie", 120_000),
                ("Ana Maria Ciobanu", "anamaria.invata", 90_000),
                ("Elena Dobre", "elena.istorie", 70_000)
            ],
            [CreatorCategory.Lifestyle] =
            [
                ("Codin Maticiuc", "codinmaticiuc", 500_000),
                ("Gina Pistol", "ginapistol", 450_000),
                ("Andreea Bălăucă", "andreea.lifestyle", 260_000),
                ("Roxana Nemeș", "roxana.daily", 130_000),
                ("Alexandra Ungureanu", "alexandra.vibe", 95_000)
            ],
            [CreatorCategory.Gaming] =
            [
                ("BashBrother", "bash_brother", 350_000),
                ("Cristian Leția", "iamcristi", 180_000),
                ("Andrei Șerban", "andyplays", 140_000),
                ("Vlad Ciobanu", "vladgaming", 90_000),
                ("Iulia Marin", "iulia.plays", 60_000)
            ],
            [CreatorCategory.Music] =
            [
                ("Delia", "deliamusic", 1_100_000),
                ("Smiley", "smiley", 1_000_000),
                ("Irina Rimes", "irinarimes", 850_000),
                ("Tzanca Uraganu", "tzancauraganu", 700_000),
                ("Carla's Dreams", "carlasdreams", 600_000)
            ]
        };

    private static readonly IReadOnlyDictionary<CreatorCategory, string[]> ClipTitles =
        new Dictionary<CreatorCategory, string[]>
        {
            [CreatorCategory.Food] =
            [
                "Rețetă rapidă de sarmale", "Cum fac cel mai bun cozonac", "Mămăligă cu brânză și smântână",
                "Papanași ca la mama acasă", "Ce gătesc într-o zi aglomerată", "Secretul unei ciorbe perfecte"
            ],
            [CreatorCategory.Sport] =
            [
                "Antrenament de 10 minute acasă", "Cum slăbesc sănătos", "Rutina mea de dimineață",
                "Greșeli la genuflexiuni", "Ce mănânc într-o zi de sală", "Program pentru începători"
            ],
            [CreatorCategory.Tech] =
            [
                "Primul contact cu noul telefon", "Merită sau nu acest gadget?", "Setări pe care le schimb imediat",
                "Trucuri ascunse din telefon", "Testez un gadget viral", "Cum îmi organizez biroul"
            ],
            [CreatorCategory.Beauty] =
            [
                "Machiaj natural de zi", "Rutina mea de skincare", "Testez un produs viral",
                "Cum îmi aranjez părul rapid", "Trucuri de machiaj pentru fiecare zi", "Get ready with me"
            ],
            [CreatorCategory.Travel] =
            [
                "48 de ore în Brașov", "Cât costă o vacanță în Grecia", "Locuri ascunse din România",
                "Ce iau în bagajul de mână", "O zi în Delta Dunării", "Cel mai frumos sat din Maramureș"
            ],
            [CreatorCategory.Comedy] =
            [
                "Când mama te sună de 10 ori", "Tipuri de colegi la birou", "Româna vs. engleza",
                "Reacția mea la factură", "Când zici că nu mai mănânci dulce", "Părinții mei și tehnologia"
            ],
            [CreatorCategory.Education] =
            [
                "Explic gravitația în 60 de secunde", "Trei greșeli de gramatică", "Cum înveți mai eficient",
                "Un fapt istoric puțin știut", "Matematica din viața reală", "De ce e cerul albastru"
            ],
            [CreatorCategory.Lifestyle] =
            [
                "Rutina mea de duminică", "Cum îmi organizez săptămâna", "O zi din viața mea",
                "Cum îmi decorez casa", "Obiceiuri care mi-au schimbat viața", "Ce cumpăr de la piață"
            ],
            [CreatorCategory.Gaming] =
            [
                "Cel mai greu boss din joc", "Reacția mea la final", "Setup-ul meu de gaming",
                "Momente amuzante din stream", "Primul meu meci clasat", "Testez un joc nou"
            ],
            [CreatorCategory.Music] =
            [
                "Fragment din piesa nouă", "Cover live acasă", "Din culisele clipului",
                "Cum compun o melodie", "Repetiție înainte de concert", "Vă cânt ce cereți voi"
            ]
        };

    private static readonly IReadOnlyDictionary<CreatorCategory, string> AudienceByCategory =
        new Dictionary<CreatorCategory, string>
        {
            [CreatorCategory.Food] = "Pasionați de gătit între 25 și 45 de ani, majoritatea femei din mediul urban.",
            [CreatorCategory.Sport] = "Tineri activi 18–35 de ani, interesați de fitness și alimentație sănătoasă.",
            [CreatorCategory.Tech] = "Bărbați 20–40 de ani pasionați de gadgeturi și noutăți tehnologice.",
            [CreatorCategory.Beauty] = "Femei 16–34 de ani interesate de machiaj, skincare și trenduri.",
            [CreatorCategory.Travel] = "Adulți 25–45 de ani care planifică vacanțe și city break-uri.",
            [CreatorCategory.Comedy] = "Public larg 16–35 de ani care caută conținut de divertisment.",
            [CreatorCategory.Education] = "Elevi, studenți și părinți interesați de învățare accesibilă.",
            [CreatorCategory.Lifestyle] = "Femei 20–40 de ani interesate de organizare, casă și rutine.",
            [CreatorCategory.Gaming] = "Gameri 14–30 de ani, majoritatea băieți, activi seara.",
            [CreatorCategory.Music] = "Fani de muzică 16–40 de ani, urmăresc lansări și momente live."
        };

    private static readonly string[] Goals =
    [
        "Să ajung la 1 milion de urmăritori", "Să colaborez pe termen lung cu un brand",
        "Să trăiesc din creație de conținut", "Să îmi diversific tipurile de conținut",
        "Să cresc rata de engagement", "Să lansez propriul produs"
    ];

    private static readonly string[] Values =
    [
        "Autenticitate", "Transparență", "Sustenabilitate", "Educație", "Umor", "Comunitate", "Incluziune"
    ];

    private static readonly string[] Formats =
    [
        "tutorial", "storytime", "review", "vlog", "sketch", "get-ready-with-me", "live"
    ];

    private static readonly string[] BrandPool =
    [
        "eMAG", "Dedeman", "Dacia", "Farmec", "Borsec", "Kaufland", "Orange România", "Glovo", "Samsung", "L'Oréal"
    ];

    private static readonly string[] ExcludedBrandPool =
    [
        "un brand de jocuri de noroc", "un brand de fast-food", "un brand de tutun", "o platformă de criptomonede"
    ];
}
