import MonitorData from './MonitorData.js';

export default class ResPerformance extends MonitorData {
  constructor(performance) {
    super();
    this.timings = performance
  }
}
