import { AxiosRequestConfig } from 'axios';

interface QueuedRequest {
  config: AxiosRequestConfig;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

class RequestQueue {
  private queue: QueuedRequest[] = [];

  /**
   * Adds a failed offline request to the queue.
   */
  add(config: AxiosRequestConfig, resolve: any, reject: any) {
    this.queue.push({ config, resolve, reject });
  }

  /**
   * Retries all queued requests.
   * Processes the queue sequentially to maintain order.
   */
  async process(axiosInstance: any) {
    if (this.queue.length === 0) return;

    const currentQueue = [...this.queue];
    this.queue = [];

    for (const request of currentQueue) {
      try {
        const response = await axiosInstance(request.config);
        request.resolve(response);
      } catch (error) {
        request.reject(error);
      }
    }
  }

  get length() {
    return this.queue.length;
  }
}

export const requestQueue = new RequestQueue();
