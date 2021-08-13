const ng = require('unique-names-generator');


// const numberDictionary = ng.NumberDictionary.generate({ min: 0, max: 9999 });
// const characterName = ng.uniqueNamesGenerator({
// dictionaries: [ng.adjectives, ng.animals, ng.names, ng.colors, ng.starWars, numberDictionary],
//   length: 3,
//   separator: '',
// //   style: 'capital'
// }); // DangerousSnake123
// console.log(characterName)
// for (let i = 0; i < 100; i++) {
//     const numberDictionary = ng.NumberDictionary.generate({
//         min: 0,
//         max: 999
//     });
//     let prob = Math.random()
//     let prob2 = Math.random()
//     let name = ng.uniqueNamesGenerator({
//         dictionaries: [ng.adjectives.concat(ng.animal).concat(ng.colors).concat(ng.names).concat(ng.colors).concat(ng.starWars), ng.adjectives.concat(ng.animal).concat(ng.colors).concat(ng.names).concat(ng.colors).concat(ng.starWars), prob > 0.7 ? numberDictionary : [""]],
//         length: prob > 0.7 ? 3 : 2,
//         separator: Math.random() > 0.8 ? "_" : '',
//         style: prob2>.2?'capital':prob2>.4?'upperCase':prob2>.6?'lowerCase':""
//     }); // DangerousSnake123
//     name=name.replace(/\s/g, "")
//     console.log(name)
// }
const NameGenerator = (withNum) => {
    const numberDictionary = ng.NumberDictionary.generate({
        min: 0,
        max: 999
    });
    let prob = Math.random()
    let prob2 = Math.random()
    let name = ng.uniqueNamesGenerator({
        dictionaries: [ng.adjectives.concat(ng.animal).concat(ng.colors).concat(ng.names).concat(ng.starWars), ng.adjectives.concat(ng.animal).concat(ng.colors).concat(ng.names).concat(ng.starWars), prob > 0.7 ? numberDictionary : [""]],
        length: (prob > 0.7 || withNum) ? 3 : 2,
        separator: Math.random() > 0.8 ? "_" : '',
        style: prob2>.2?'capital':prob2>.4?'upperCase':prob2>.6?'lowerCase':""
    }); // DangerousSnake123
    name=name.replace(/\s/g, "")
    console.log(`create user using name:${name}`)
    return name
} 

module.exports = NameGenerator;