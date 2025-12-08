import cron from 'node-cron';
import { generateArticle } from './aiClient.js';
import Article from '../models/Article.js';

let isJobRunning = false;

export async function generateAndSaveArticle() {
  if (isJobRunning) {
    console.log('⏳ Article generation already in progress, skipping...');
    return;
  }

  isJobRunning = true;
  
  try {
    console.log('🚀 Starting article generation...');
    
    const articleData = await generateArticle();
    const article = await Article.create(articleData);
    
    console.log(`Article created successfully! ID: ${article.id}, Title: "${article.title}"`);
    
    return article;
  } catch (error) {
    console.error('Error generating article:', error);
    throw error;
  } finally {
    isJobRunning = false;
  }
}

// Initialize cron job - runs daily at 9:00 AM
export function startArticleScheduler() {
  // Cron format: minute hour day month dayOfWeek
  // '0 9 * * *' = Every day at 9:00 AM
  const cronExpression = '0 9 * * *';
  
  cron.schedule(cronExpression, async () => {
    console.log('Daily article generation triggered');
    await generateAndSaveArticle();
  });
  
  console.log(`Article scheduler started - will run daily at 9:00 AM`);
}

// For testing: Generate article immediately on startup if needed
export async function generateInitialArticles() {
  const count = await Article.count();
  
  if (count < 3) {
    console.log(`Current articles: ${count}/3. Generating initial articles...`);
    
    const needed = 3 - count;
    for (let i = 0; i < needed; i++) {
      console.log(`\nGenerating article ${i + 1}/${needed}...`);
      await generateAndSaveArticle();
      
      // Wait 5 seconds between generations to avoid rate limiting
      if (i < needed - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  } else {
    console.log(`Already have ${count} articles. No need to generate initial content.`);
  }
}

export default { startArticleScheduler, generateAndSaveArticle, generateInitialArticles };
