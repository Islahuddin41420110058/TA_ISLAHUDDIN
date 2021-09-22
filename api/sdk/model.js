const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // s & k
    s = (data[0] - 29.5) / 4.609959082
    k = (data[1] - 422.2222222) / 195.11212
 
    return [s, k]
}

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]). reduce(compareFn)[1]
const argMax = argFact((min, el) => (el[0] > min[0] ? el : min ))

function ArgMax(res){
    console.log(cls_data, argMax(cls_data));
    
  if(argMax(cls_data) == 1){
      label = "POWER ON"
  }if(argMax(cls_data) == 0){
      label = "POWER OFF"
  }
 return label
}

async function classify(data){
    let in_dim = 2; // s k
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/Islahuddin41420110058/botjstclassification/main/public/cls_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return ArgMax( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    classify: classify 
}
  
