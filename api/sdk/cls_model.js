const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // s & k
    suhu = (data[0])
    kelembaban = (data[1])
    keluaran = (data[2])
    
    return [suhu, kelembaban, keluaran]
}

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]). reduce(compareFn)[1]
const argMax = argFact((min, el) => (el[0] > min[0] ? el : min ))

function ArgMax(res){
    label = "POWER OFF"
    cls_data = []
    for(i=0; i<res.length; i++){
        cls_data[i] = res[i]
    }
    console.log(cls_data, argMax(cls_data));
    if(argMax(cls_data) == 1){
      label = "POWER ON"
    }
    return label
}
    

async function classify(data){
    let in_dim = 3; // i r v p
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/Islahuddin41420110058/TA_ISLAHUDDIN/main/public/cls_model/model.json';
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
  
