export default {
  "name": "left",
  "timbreConfig": {
    "synthConfig": {
      "oscillator": {
        "partials": [1, 0.135, 0.045, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    "pannerConfig": {
      "positionX": -4.05,
      "positionY": 0,
      "positionZ": 0
    },
    "autoPannerConfig": {
      "depth": "0.5",
      "frequency": "1.2"
    }
  },
  "eventConfig": {
    "volume": {
      "min": -10,
      "max": 0
    },
    "eventOptions": [{
      "weight": 1,
      "option": 1
    }],
    "octaveOptions": [{
      "weight": 0.75,
      "option": 3
    }, {
      "weight": 0.25,
      "option": 4
    }],
    "attack": {
      "min": 1,
      "max": 5
    },
    "release": {
      "min": 1,
      "max": 5
    },
    "duration": {
      "min": "5",
      "max": "10"
    }
  },
  "waveConfig": {
    "rest": {
      "min": 1,
      "max": 5
    }
  }

}