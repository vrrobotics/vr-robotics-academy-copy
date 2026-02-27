/**
 * Razorpay Payment Service
 * Handles payment processing for demo bookings
 */

interface RazorpayOptions {
  amount: number; // Amount in minor units of `currency` (e.g. 100 cents = USD 1)
  currency?: string;
  description?: string;
  name?: string;
  prefillEmail?: string;
  prefillPhone?: string;
  prefillName?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

interface ClientRegionContext {
  countryCode: string;
  preferredCurrency: string;
}

export class RazorpayService {
  private static readonly KEY_ID =
    ((import.meta as any)?.env?.VITE_RAZORPAY_KEY_ID as string) || 'rzp_test_SLEljQjEAaLhr7';
  private static readonly SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

  private static readonly PRODUCT_DESCRIPTION =
    'VR Robotics demo class booking for students. Hands-on robotics and AI learning session.';

  private static toRazorpayDescription(value?: string): string {
    const fallback = this.PRODUCT_DESCRIPTION;
    const raw = (value || fallback).trim();
    return raw.length > 255 ? raw.slice(0, 252) + '...' : raw;
  }

  private static loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = this.SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }

  private static getClientRegionContext(): ClientRegionContext {
    const envDefaultCountry = (((import.meta as any)?.env?.VITE_DEFAULT_COUNTRY as string) || '').toUpperCase();
    if (envDefaultCountry === 'IN') {
      return { countryCode: 'IN', preferredCurrency: 'INR' };
    }
    if (envDefaultCountry) {
      return { countryCode: envDefaultCountry, preferredCurrency: 'USD' };
    }

    const forcedCountry =
      typeof window !== 'undefined'
        ? (window.localStorage.getItem('vr_force_country') || '').toUpperCase()
        : '';

    if (forcedCountry === 'IN') {
      return { countryCode: 'IN', preferredCurrency: 'INR' };
    }
    if (forcedCountry && forcedCountry !== 'IN') {
      return { countryCode: forcedCountry, preferredCurrency: 'USD' };
    }

    const locale = typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';
    const locales = typeof navigator !== 'undefined' ? navigator.languages || [locale] : [locale];
    const localeParts = locale.split('-');
    let countryCode = (localeParts[1] || '').toUpperCase();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const offsetMinutes = -new Date().getTimezoneOffset(); // e.g. IST => +330
    const isIndiaTimezone =
      timeZone.includes('Asia/Kolkata') ||
      timeZone.includes('Asia/Calcutta') ||
      offsetMinutes === 330;
    const isIndiaLocale = locales.some((l) => l.toUpperCase().includes('-IN'));

    // Prefer explicit India timezone even if browser locale is set to another country.
    if (isIndiaTimezone || isIndiaLocale) {
      countryCode = 'IN';
    } else if (!countryCode) {
      // Fallback for browsers that provide locale without region (e.g. "en")
      countryCode = 'US';
    }

    const preferredCurrency = (() => {
      switch (countryCode) {
        case 'IN': return 'INR';
        case 'GB': return 'GBP';
        case 'AE': return 'AED';
        case 'SG': return 'SGD';
        case 'CA': return 'CAD';
        case 'AU': return 'AUD';
        case 'DE':
        case 'FR':
        case 'IT':
        case 'ES': return 'EUR';
        default: return 'USD';
      }
    })();

    return {
      countryCode,
      preferredCurrency
    };
  }

  private static async createOrder(amount: number, currency: string): Promise<RazorpayOrderResponse> {
    const { countryCode, preferredCurrency } = this.getClientRegionContext();

    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency,
        preferredCurrency,
        countryCode
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload?.order?.id) {
      throw new Error(payload?.error || 'Unable to create Razorpay order');
    }

    return payload.order as RazorpayOrderResponse;
  }

  static async initiatePayment(options: RazorpayOptions): Promise<void> {
    try {
      if (!this.KEY_ID) {
        throw new Error('Missing VITE_RAZORPAY_KEY_ID. Configure it in your env file.');
      }

      await this.loadRazorpayScript();
      const region = this.getClientRegionContext();
      let order: RazorpayOrderResponse | null = null;
      try {
        order = await this.createOrder(options.amount, options.currency || 'USD');
      } catch (createOrderError) {
        console.warn('[Razorpay] Order creation failed, using fallback checkout mode', createOrderError);
      }

      const fallbackCurrency = region.countryCode === 'IN' ? 'INR' : (options.currency || 'USD');
      const fallbackAmount = region.countryCode === 'IN' ? 9105 : options.amount; // ~₹91.05 for $1

      const razorpayOptions: any = {
        key: this.KEY_ID,
        amount: order?.amount || fallbackAmount,
        currency: order?.currency || fallbackCurrency,
        name: options.name || 'VR Robotics Academy',
        description: this.toRazorpayDescription(options.description),
        image: 'https://res.cloudinary.com/dicfqwlfq/image/upload/v1764505259/VR_Robotics_Logo_upscaled_1_rrrrn8.png',
        handler: (response: any) => {
          if (options.onSuccess) {
            options.onSuccess(response);
            return;
          }
          this.defaultSuccessHandler(response);
        },
        prefill: {
          name: options.prefillName || '',
          email: options.prefillEmail || '',
          contact: options.prefillPhone || ''
        },
        notes: {
          note_key_1: 'Demo Booking',
          note_key_2: 'VR Robotics Academy',
          program: 'Robotics Course (Grades 1-12)'
        },
        method: {},
        theme: {
          color: '#ff8c42'
        },
        modal: {
          ondismiss: () => {
            if (options.onError) {
              options.onError({ message: 'Payment cancelled' });
            }
          }
        }
      };

      const isIndiaOrder =
        (order?.currency || fallbackCurrency || 'USD').toUpperCase() === 'INR' ||
        region.countryCode === 'IN';
      razorpayOptions.method = isIndiaOrder
        ? {
            upi: true,
            card: false,
            netbanking: false,
            wallet: false
          }
        : {
            upi: false,
            card: true,
            netbanking: false,
            wallet: false
          };

      if (order?.id) {
        razorpayOptions.order_id = order.id;
      }

      // @ts-ignore Razorpay is loaded from checkout.js at runtime
      const rzp = new window.Razorpay(razorpayOptions);
      rzp.on('payment.failed', (response: any) => {
        const reason = response?.error?.description || response?.error?.reason || 'Payment failed';
        if (options.onError) {
          options.onError({ message: reason, details: response?.error || response });
        }
      });
      rzp.open();
    } catch (error) {
      console.error('[Razorpay] initiatePayment failed:', error);
      const message = error instanceof Error ? error.message : 'Unable to open payment checkout';
      if (options.onError) {
        options.onError(error);
      }
      alert(message);
    }
  }

  static async initiateDemo1DollarPayment(
    onSuccess?: (response: any) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    await this.initiatePayment({
      amount: 100, // 100 cents = USD 1
      currency: 'USD',
      description: this.PRODUCT_DESCRIPTION,
      name: 'VR Robotics Academy',
      onSuccess,
      onError
    });
  }

  private static defaultSuccessHandler(response: any): void {
    const message = `Payment successful.\n\nPayment ID: ${response.razorpay_payment_id}`;
    alert(message);
  }
}

export default RazorpayService;
