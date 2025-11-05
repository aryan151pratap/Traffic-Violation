export const analyticsData = {
  model1: {
    name: "YOLO Model 1",
    summary: {
      mAP50: 0.7838,
      mAP50_95: 0.5819,
      precision: 0.8142,
      recall: 0.7102,
      f1: 0.7514
    },
    perClass: {
      car: 0.5610,
      person: 0.5778,
      "without helmet": 0.2407,
      bike: 0.5506,
      auto: 0.7019,
      "overloaded bike": 0.4411,
      truck: 0.6822,
      "with helmet": 0.2658,
      "number plate": 0.5257,
      "mobile usage": 0.5296,
      ambulance: 0.8567,
      bus: 0.6568,
      "road animal": 0.6744,
      animal: 0.7729,
      rider: 0.6916
    }
  },

  model2: {
    name: "YOLO Model 2",
    summary: {
      mAP50: 0.9586,
      mAP50_95: 0.8027,
      precision: 0.9588,
      recall: 0.8963,
      f1: 0.9248
    },
    perClass: {
      car: 0.8288,
      person: 0.7639,
      "without helmet": 0.7160,
      bike: 0.7831,
      auto: 0.8365,
      "overloaded bike": 0.7747,
      truck: 0.8359,
      "with helmet": 0.6797,
      "number plate": 0.7106,
      "mobile usage": 0.7082,
      ambulance: 0.8868,
      bus: 0.8767,
      "road animal": 0.8524,
      animal: 0.8878,
      rider: 0.8986
    }
  }
};
