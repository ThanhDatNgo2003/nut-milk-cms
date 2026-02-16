import { PrismaClient, Role, PostStatus, Language } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://nutmilk:password@localhost:5433/nutmilk_cms";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data in correct order (respect FK constraints)
  await prisma.auditLog.deleteMany();
  await prisma.pageView.deleteMany();
  await prisma.featuredContent.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.settings.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@nutmilk.vn",
      name: "Admin",
      password: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log("  Admin user created:", admin.email);

  // Create editor user
  const editorPassword = await bcrypt.hash("editor123", 12);
  const editor = await prisma.user.create({
    data: {
      email: "editor@nutmilk.vn",
      name: "Editor",
      password: editorPassword,
      role: Role.EDITOR,
      isActive: true,
    },
  });
  console.log("  Editor user created:", editor.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Recipes", slug: "recipes", description: "Nut milk recipes and preparation guides" },
    }),
    prisma.category.create({
      data: { name: "Health and Nutrition", slug: "health-nutrition", description: "Health benefits and nutritional information" },
    }),
    prisma.category.create({
      data: { name: "News", slug: "news", description: "Latest news and updates from Nut Milk" },
    }),
    prisma.category.create({
      data: { name: "Tips and Tricks", slug: "tips-tricks", description: "Useful tips for making and using nut milk" },
    }),
  ]);
  console.log("  " + categories.length + " categories created");

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Almond", slug: "almond" } }),
    prisma.tag.create({ data: { name: "Cashew", slug: "cashew" } }),
    prisma.tag.create({ data: { name: "Coconut", slug: "coconut" } }),
    prisma.tag.create({ data: { name: "Macadamia", slug: "macadamia" } }),
    prisma.tag.create({ data: { name: "Vegan", slug: "vegan" } }),
    prisma.tag.create({ data: { name: "Sugar-Free", slug: "sugar-free" } }),
    prisma.tag.create({ data: { name: "Organic", slug: "organic" } }),
    prisma.tag.create({ data: { name: "Protein", slug: "protein" } }),
  ]);
  console.log("  " + tags.length + " tags created");

  // Create blog posts
  const post1 = await prisma.post.create({
    data: {
      title: "The Complete Guide to Almond Milk",
      slug: "complete-guide-almond-milk",
      content: "<h2>Why Almond Milk?</h2><p>Almond milk is one of the most popular plant-based milk alternatives. Rich in vitamin E and low in calories.</p><h2>How We Make It</h2><p>Our almond milk is made from premium, organic almonds sourced from the finest farms.</p>",
      excerpt: "Discover everything about almond milk - from health benefits to our premium blend.",
      categoryId: categories[0].id,
      authorId: admin.id,
      language: Language.VI,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      metaTitle: "Complete Guide to Almond Milk | Nut Milk",
      metaDescription: "Learn about almond milk health benefits and how Nut Milk creates premium beverages.",
      metaKeywords: ["almond milk", "plant-based", "dairy-free"],
      tags: { connect: [{ id: tags[0].id }, { id: tags[4].id }, { id: tags[6].id }] },
    },
  });

  await prisma.post.create({
    data: {
      title: "5 Benefits of Switching to Nut Milk",
      slug: "5-benefits-switching-nut-milk",
      content: "<h2>Why Make the Switch?</h2><p>Switching from dairy to nut milk offers numerous health and environmental benefits.</p><ol><li>Lower in calories</li><li>Rich in healthy fats</li><li>Environmentally sustainable</li><li>Lactose-free</li><li>Versatile for cooking</li></ol>",
      excerpt: "Explore the top 5 reasons to switch from dairy to plant-based nut milk.",
      categoryId: categories[1].id,
      authorId: editor.id,
      language: Language.VI,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 86400000),
      metaTitle: "5 Benefits of Nut Milk | Health & Nutrition",
      metaDescription: "Discover the health benefits of switching to plant-based nut milk alternatives.",
      metaKeywords: ["nut milk benefits", "plant-based diet", "healthy living"],
      tags: { connect: [{ id: tags[4].id }, { id: tags[7].id }] },
    },
  });

  await prisma.post.create({
    data: {
      title: "Cashew Milk: The Creamiest Alternative",
      slug: "cashew-milk-creamiest-alternative",
      content: "<p>Cashew milk stands out for its incredibly creamy texture. Perfect for coffee, smoothies, and cooking.</p>",
      excerpt: "Why cashew milk is the creamiest dairy-free option for your daily beverages.",
      categoryId: categories[0].id,
      authorId: admin.id,
      language: Language.VI,
      status: PostStatus.DRAFT,
      metaKeywords: ["cashew milk", "creamy", "dairy-free"],
      tags: { connect: [{ id: tags[1].id }, { id: tags[4].id }] },
    },
  });
  // English translation of almond milk guide
  const post1En = await prisma.post.create({
    data: {
      title: "The Complete Guide to Almond Milk",
      slug: "complete-guide-almond-milk",
      content: "<h2>Why Almond Milk?</h2><p>Almond milk is one of the most popular plant-based milk alternatives. Rich in vitamin E and low in calories.</p><h2>How We Make It</h2><p>Our almond milk is made from premium, organic almonds sourced from the finest farms.</p>",
      excerpt: "Discover everything about almond milk - from health benefits to our premium blend.",
      categoryId: categories[0].id,
      authorId: admin.id,
      language: "EN",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      metaTitle: "Complete Guide to Almond Milk | Nut Milk",
      metaDescription: "Learn about almond milk health benefits and how Nut Milk creates premium beverages.",
      metaKeywords: ["almond milk", "plant-based", "dairy-free"],
      tags: { connect: [{ id: tags[0].id }, { id: tags[4].id }, { id: tags[6].id }] },
    },
  });

  // Link translation group
  await prisma.post.update({
    where: { id: post1.id },
    data: { translationGroupId: post1.id },
  });
  await prisma.post.update({
    where: { id: post1En.id },
    data: { translationGroupId: post1.id },
  });
  console.log("  English translation linked to almond milk guide");

  console.log("  4 blog posts created (3 published, 1 draft)");

  // Featured content
  await prisma.featuredContent.create({ data: { postId: post1.id, position: 1 } });
  console.log("  Featured content set");

  // Create products
  await prisma.product.create({
    data: {
      name: "Original Almond Milk", slug: "original-almond-milk",
      language: Language.VI,
      description: "Our signature almond milk made from premium organic almonds. Smooth, creamy, and naturally delicious.",
      price: 65000, image: "/images/almond-milk.jpg",
      images: ["/images/almond-milk.jpg", "/images/almond-milk-2.jpg"],
      category: "milk", tags: ["almond", "organic", "sugar-free"],
      isFeatured: true, featuredPosition: 1, featuredLabel: "Best Seller",
      metaTitle: "Original Almond Milk", metaDescription: "Premium organic almond milk by Nut Milk Vietnam",
      metaKeywords: ["almond milk", "organic"],
      variants: { create: [
        { size: "250ml", price: 35000, stock: 100 },
        { size: "500ml", price: 65000, stock: 75 },
        { size: "1L", price: 120000, stock: 50 },
      ]},
    },
  });

  await prisma.product.create({
    data: {
      name: "Cashew Milk Blend", slug: "cashew-milk-blend",
      language: Language.VI,
      description: "Ultra-creamy cashew milk blended with a hint of vanilla. Perfect for coffee and smoothies.",
      price: 75000, image: "/images/cashew-milk.jpg",
      images: ["/images/cashew-milk.jpg"],
      category: "milk", tags: ["cashew", "vanilla", "creamy"],
      isFeatured: true, featuredPosition: 2, featuredLabel: "New",
      metaTitle: "Cashew Milk Blend", metaDescription: "Ultra-creamy cashew milk blend by Nut Milk Vietnam",
      metaKeywords: ["cashew milk", "vanilla"],
      variants: { create: [
        { size: "250ml", price: 40000, stock: 80 },
        { size: "500ml", price: 75000, stock: 60 },
        { size: "1L", price: 140000, stock: 40 },
      ]},
    },
  });

  await prisma.product.create({
    data: {
      name: "Macadamia Milk Premium", slug: "macadamia-milk-premium",
      language: Language.VI,
      description: "Luxurious macadamia nut milk with a rich, buttery flavor. Our most premium offering.",
      price: 95000, image: "/images/macadamia-milk.jpg",
      images: ["/images/macadamia-milk.jpg"],
      category: "milk", tags: ["macadamia", "premium", "organic"],
      isFeatured: true, featuredPosition: 3, featuredLabel: "Premium",
      metaTitle: "Macadamia Milk Premium", metaDescription: "Premium macadamia nut milk by Nut Milk Vietnam",
      metaKeywords: ["macadamia milk", "premium"],
      variants: { create: [
        { size: "250ml", price: 50000, stock: 60 },
        { size: "500ml", price: 95000, stock: 45 },
      ]},
    },
  });

  await prisma.product.create({
    data: {
      name: "Coconut Almond Mix", slug: "coconut-almond-mix",
      language: Language.VI,
      description: "A tropical twist blending coconut and almond milk. Refreshing and nutritious.",
      price: 70000, image: "/images/coconut-almond.jpg",
      images: ["/images/coconut-almond.jpg"],
      category: "milk", tags: ["coconut", "almond", "tropical"],
      isFeatured: false,
      metaTitle: "Coconut Almond Mix", metaDescription: "Coconut and almond milk blend by Nut Milk Vietnam",
      metaKeywords: ["coconut milk", "almond milk"],
      variants: { create: [
        { size: "500ml", price: 70000, stock: 55 },
        { size: "1L", price: 130000, stock: 30 },
      ]},
    },
  });
  console.log("  4 products created with variants");

  // Settings
  await prisma.settings.create({
    data: {
      siteName: "Nut Milk", siteUrl: "https://nutmilk.vn",
      language: Language.VI,
      email: "hello@nutmilk.vn", phone: "+84 123 456 789",
      address: "Ho Chi Minh City, Vietnam",
      tiktok: "https://tiktok.com/@nutmilk.vn",
      instagram: "https://instagram.com/nutmilk.vn",
      facebook: "https://facebook.com/nutmilk.vn",
      enableComments: true, enableNewsletter: true,
    },
  });
  console.log("  Site settings created");

  // Page views for analytics
  const paths = ["/", "/blog", "/products", "/blog/complete-guide-almond-milk", "/products/original-almond-milk"];
  for (let i = 0; i < 50; i++) {
    await prisma.pageView.create({
      data: {
        path: paths[Math.floor(Math.random() * paths.length)],
        referer: Math.random() > 0.5 ? "https://google.com" : null,
        userAgent: "Mozilla/5.0",
        createdAt: new Date(Date.now() - Math.random() * 7 * 86400000),
      },
    });
  }
  console.log("  50 sample page views created");

  console.log("\nDatabase seeded successfully.");
  console.log("  Admin: admin@nutmilk.vn / admin123");
  console.log("  Editor: editor@nutmilk.vn / editor123");
}

main()
  .then(async () => { await prisma.$disconnect(); await pool.end(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); await pool.end(); process.exit(1); });
