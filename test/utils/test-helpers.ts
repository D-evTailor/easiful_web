import { Page, expect } from '@playwright/test';

// Test constants
export const TEST_URLS = {
  ES: {
    LOGIN: '/es/login',
    DASHBOARD: '/es/dashboard',
  },
  EN: {
    LOGIN: '/en/login', 
    DASHBOARD: '/en/dashboard',
  }
} as const;

export const ERROR_MESSAGES = {
  ES: {
    USER_NOT_FOUND: 'No eres parte de la familia Easiful',
    INVALID_CREDENTIALS: 'Las credenciales son incorrectas',
    OAUTH_ERROR: 'Error en la autenticación con Google',
  },
  EN: {
    USER_NOT_FOUND: 'You are not part of the Easiful family',
    INVALID_CREDENTIALS: 'Invalid credentials',
    OAUTH_ERROR: 'Error with Google authentication',
  }
} as const;

export const BUTTON_TEXTS = {
  ES: {
    SIGN_IN: 'Iniciar sesión',
    SIGNING_IN: 'Iniciando sesión...',
    DOWNLOAD_APP: 'Descarga la App para registrarte',
  },
  EN: {
    SIGN_IN: 'Sign in',
    SIGNING_IN: 'Signing in...',
    DOWNLOAD_APP: 'Download the App to Sign up',
  }
} as const;

export const TEST_USERS = {
  NON_EXISTENT: {
    email: 'nonexistent@user.com',
    password: 'wrongpassword123'
  },
  EXISTING_WRONG_PASSWORD: {
    email: 'test@existente.com',
    password: 'wrongpassword123'
  },
  // Add your test users here when setting up Firebase test data
  VALID_TEST_USER: {
    email: 'test@valid.com',
    password: 'validpassword123'
  }
} as const;

export const EXTERNAL_URLS = {
  EASIFUL_APP: 'https://easiful.vercel.app/'
} as const;

// Form field selectors
export const SELECTORS = {
  EMAIL_INPUT: 'input[name="email"]',
  PASSWORD_INPUT: 'input[name="password"]',
  SUBMIT_BUTTON: 'button[type="submit"]',
  ERROR_MESSAGE: '.text-red-500, [role="alert"]',
  LOADING_INDICATOR: '.animate-spin',
} as const;

// Utility functions for common test operations
export class TestUtils {
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  static async waitForElementToBeVisible(page: Page, selector: string, timeout = 10000) {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  static async waitForNavigation(page: Page, expectedUrl: string | RegExp) {
    await page.waitForURL(expectedUrl);
  }

  static async clearAndFill(page: Page, selector: string, text: string) {
    await page.locator(selector).clear();
    await page.locator(selector).fill(text);
  }

  static async expectElementNotPresent(page: Page, selector: string) {
    const count = await page.locator(selector).count();
    expect(count).toBe(0);
  }

  static async expectElementPresent(page: Page, selector: string) {
    const count = await page.locator(selector).count();
    expect(count).toBeGreaterThan(0);
  }

  static async handleNewPage(page: Page, action: () => Promise<void>, expectedUrl?: string) {
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      action()
    ]);
    
    await newPage.waitForLoadState();
    
    if (expectedUrl) {
      expect(newPage.url()).toBe(expectedUrl);
    }
    
    return newPage;
  }

  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}

// Language-specific helper functions
export class LanguageHelper {
  static getErrorMessage(locale: 'es' | 'en', errorType: keyof typeof ERROR_MESSAGES.ES) {
    return ERROR_MESSAGES[locale.toUpperCase() as keyof typeof ERROR_MESSAGES][errorType];
  }

  static getButtonText(locale: 'es' | 'en', buttonType: keyof typeof BUTTON_TEXTS.ES) {
    return BUTTON_TEXTS[locale.toUpperCase() as keyof typeof BUTTON_TEXTS][buttonType];
  }

  static getUrl(locale: 'es' | 'en', urlType: keyof typeof TEST_URLS.ES) {
    return TEST_URLS[locale.toUpperCase() as keyof typeof TEST_URLS][urlType];
  }
}

// Mock data generators for testing
export class MockDataGenerator {
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    return `test${timestamp}@example.com`;
  }

  static generateRandomPassword(length = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateTestUser() {
    return {
      email: this.generateRandomEmail(),
      password: this.generateRandomPassword(),
      name: `Test User ${Date.now()}`
    };
  }
}

// Environment setup helpers
export class TestEnvironment {
  static async setupTestData() {
    // Add any test data setup logic here
    console.log('Setting up test data...');
  }

  static async cleanupTestData() {
    // Add any test data cleanup logic here
    console.log('Cleaning up test data...');
  }

  static isCI(): boolean {
    return !!process.env.CI;
  }

  static getBaseUrl(): string {
    return process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3009';
  }
} 