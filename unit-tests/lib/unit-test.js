function isEquivalent(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }
  
  if (typeof a === "object") {
    if (a === null || b === null) {
      return (a === b);
    }
    
    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (!isEquivalent(a[propName], b[propName])) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }
  
  return a === b;      
}   

function unitTest(result, expected) {
  let isCorrect = isEquivalent(result, expected);
  return {
    isCorrect: isCorrect,
    message: "<span style='color:"+(isCorrect ? "green" : "red")+"'> Expected "+JSON.stringify(expected)+", received "+JSON.stringify(result)+"</span>"
  }        
}