-- Assemble the werewolf animation from the cut frames, tag it, scale it to pixel size and export a sheet.
local dir = app.params["dir"]
local first = Image{ fromFile = dir .. "/frame01.png" }
local spr = Sprite(first.width, first.height, ColorMode.RGB)
local layer = spr.layers[1]
layer.name = "werewolf"
local durations = { 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.30, 1.50 }
for i = 1, 8 do
  if i > 1 then spr:newEmptyFrame(i) end
  local img = Image{ fromFile = string.format("%s/frame%02d.png", dir, i) }
  spr:newCel(layer, spr.frames[i], img, Point(0, 0))
  spr.frames[i].duration = durations[i]
end
local run = spr:newTag(1, 6); run.name = "run"; run.aniDir = AniDir.FORWARD
local rise = spr:newTag(7, 7); rise.name = "rise"
local howl = spr:newTag(8, 8); howl.name = "howl"
-- down to pixel size: 96 px tall
local h = 96
local w = math.floor(spr.width * h / spr.height + 0.5)
app.command.SpriteSize{ ui = false, width = w, height = h, lockRatio = true, method = "bilinear" }
spr:saveAs(dir .. "/werewolf.aseprite")
app.command.ExportSpriteSheet{
  ui = false, askOverwrite = false,
  type = SpriteSheetType.HORIZONTAL,
  textureFilename = dir .. "/werewolf.png",
  dataFilename = dir .. "/werewolf.json",
  dataFormat = SpriteSheetDataFormat.JSON_ARRAY,
  listTags = true,
}
print("exported " .. w .. "x" .. h .. " x8")
