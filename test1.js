var obj =
{
    "analyzedAt": "2017-01-19T14:22:40.326Z",
    "collected": {
        "metadata": {
            "name": "react-native",
            "version": "0.40.0",
            "description": "A framework for building native apps using React",
            "date": "2017-01-04T12:45:32.935Z",
            "publisher": {
                "username": "bestander",
                "email": "bestander@gmail.com"
            }
        }
    },
    "evaluation": {
        "quality": {
            "carefulness": 0.49999999999999994,
            "tests": 0.6749999999999999,
            "health": 0.4736842105263158,
            "branding": 0.15
        },
        "popularity": {
            "communityInterest": 55868,
            "downloadsCount": 190193,
            "downloadsAcceleration": 712.1112823439878,
            "dependentsCount": 214
        },
        "maintenance": {
            "releasesFrequency": 1,
            "commitsFrequency": 1,
            "openIssues": 1,
            "issuesDistribution": 0.7215956988042644
        }
    },
    "score": {
        "final": 0.7984709202683978,
        "detail": {
            "quality": 0.7927460730920821,
            "popularity": 0.604772201455265,
            "maintenance": 0.9970766509469442
        }
    }
};


var traverseNested = function(nestObj, property, options = null){
  var propertyNest = nestObj[property]
  return propertyNest
}


console.log(traverseNested(obj, 'evaluation'))
