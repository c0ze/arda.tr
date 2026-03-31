type sectionIds

@module("../config/site")
external sectionIds: sectionIds = "sectionIds"

@get external aboutId: sectionIds => string = "about"
@get external portfolioId: sectionIds => string = "portfolio"
@get external musicId: sectionIds => string = "music"

let about = sectionIds->aboutId
let portfolio = sectionIds->portfolioId
let music = sectionIds->musicId
