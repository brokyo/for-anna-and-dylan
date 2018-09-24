export default {
  "name": "lead",
  "timbreConfig": {
    "synthConfig": {
      "oscillator": {
        "partials": [1, 0.445, 0.185, 0.09, 0.05, 0.04, 0, 0, 0, 0]
      }
    },
    "pannerConfig": {
      "positionX": 0,
      "positionY": 0,
      "positionZ": 0
    },
    "autoPannerConfig": {
      "depth": "0.55",
      "frequency": "1"
    }
  },
  "eventConfig": {
    "volume": {
      "min": -20,
      "max": -10
    },
    "eventOptions": [{
      "weight": 0.8,
      "option": 3
    }, {
      "option": 2,
      "weight": 0.1
    }, {
      "option": 1,
      "weight": 0.1
    }],
    "octaveOptions": [{
      "weight": 0.75,
      "option": 4
    }, {
      "weight": 0.25,
      "option": 5
    }],
    "attack": {
      "min": 1,
      "max": 3
    },
    "release": {
      "min": 1,
      "max": "3"
    },
    "duration": {
      "min": "3",
      "max": "6"
    }
  },
  "waveConfig": {
    "rest": {
      "min": 5,
      "max": 10
    }
  }
}