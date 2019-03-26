import React, { useEffect, useState, useRef } from "react"
import { useDirectoryOverride } from "../models/TimeTraveling"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHistory } from "@fortawesome/free-solid-svg-icons"
import _ from "lodash"
import { trackEvent } from "../util/analytics"

const dirNameToReadableTime = n => {
  return n.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})\d+/, "$1-$2-$3 $4:$5")
}

export function TimeMachine() {
  const styles = {
    button: {
      cursor: "pointer",
      border: 0,
      padding: 0,
      font: "inherit",
      color: "inherit",
      background: "none",
    },
  }

  const [override, setOverride] = useDirectoryOverride()
  const [hover, setHover] = useState("")
  const timeout = useRef()

  const handleKeyDown = e => {
    if (e.key === "ArrowRight") {
      moveTimeBy(1)
    } else if (e.key === "ArrowLeft") {
      moveTimeBy(-1)
    }
  }
  const moveTimeBy = dt => {
    const browsingIndex = _.findIndex(dirs, entry => entry[0] === override)
    if (browsingIndex === -1) return
    goBackTo(Math.min(dirs.length - 1, Math.max(0, browsingIndex + dt)))
  }
  const goBackTo = index => {
    const directory = dirs[index][0]
    trackEvent("Time Machine", { dir: directory })
    setOverride(directory)
  }
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [override])

  return (
    <div css={{ textAlign: "left" }}>
      <button
        css={{
          ...styles.button,
          margin: "0 8px 0 -8px",
          padding: 8,
          flex: "none",
        }}
        title={override ? "ปิดการดูข้อมูลย้อนหลัง" : "เปิดการดูข้อมูลย้อนหลัง"}
        onClick={() => (override ? setOverride(null) : goBackTo(0))}
      >
        <FontAwesomeIcon icon={faHistory} />
      </button>
      {!!override && renderControl()}
    </div>
  )

  function renderControl() {
    return (
      <div
        css={{
          flex: "auto",
          textAlign: "left",
          color: "#888",
        }}
      >
        <div
          css={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
        >
          <div css={{ flexGrow: 1 }}>
            {hover && hover !== override ? (
              <span>
                <strong>ดูข้อมูลย้อนหลัง</strong> ณ เวลา{" "}
                {dirNameToReadableTime(hover)}
              </span>
            ) : override ? (
              <span>
                <strong>ข้อมูลย้อนหลัง</strong> ณ เวลา{" "}
                {dirNameToReadableTime(override)}
              </span>
            ) : (
              <span>
                <strong>กำลังดูข้อมูลล่าสุด</strong>
              </span>
            )}
          </div>
          <div css={{ flexGrow: 1, textAlign: "right" }}>
            <div>
              เลือกช่องด้านล่างเพื่อดูข้อมูลย้อนหลัง หรือ กด{" "}
              <button css={styles.button} onClick={() => moveTimeBy(-1)}>
                ←
              </button>{" "}
              /{" "}
              <button css={styles.button} onClick={() => moveTimeBy(1)}>
                →
              </button>
            </div>
          </div>
        </div>
        <div css={{ display: override ? "block" : "none" }}>
          <div
            css={{
              display: "flex",
              height: 20,
              borderLeft: "1px solid #ddd",
            }}
          >
            {dirs.slice(0, -1).map(([directory, time, voteCount], index) => (
              <a
                key={index}
                data-active={override === directory ? true : undefined}
                href="javascript://"
                css={{
                  background: "#eee",
                  borderRight: "1px solid #ddd",
                  "&:hover": { background: "#ccc" },
                  "&[data-active]": { background: "#888" },
                }}
                style={{
                  flex: `${Math.min(dirs[index + 1][1] - time, 1800)} 0 0px`,
                }}
                onClick={() => goBackTo(index)}
                onMouseOver={() => {
                  clearTimeout(timeout.current)
                  setHover(directory)
                }}
                onMouseOut={() => {
                  timeout.current = setTimeout(() => setHover(null))
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const dirs = [
  ["20190324181931", 1553426371, 775970],
  ["20190324190105", 1553428865, 816440],
  ["20190324190306", 1553428986, 1003178],
  ["20190324190504", 1553429104, 1171723],
  ["20190324190606", 1553429166, 1407781],
  ["20190324190804", 1553429284, 1709732],
  ["20190324190905", 1553429345, 1876210],
  ["20190324191105", 1553429465, 2318251],
  ["20190324191206", 1553429526, 2547871],
  ["20190324191306", 1553429586, 2827558],
  ["20190324191405", 1553429645, 2983099],
  ["20190324191606", 1553429766, 3370046],
  ["20190324191705", 1553429825, 3562284],
  ["20190324191905", 1553429945, 3944938],
  ["20190324192105", 1553430065, 4259265],
  ["20190324192306", 1553430186, 4642435],
  ["20190324192406", 1553430246, 4855850],
  ["20190324192505", 1553430305, 5020792],
  ["20190324192704", 1553430424, 5405889],
  ["20190324192805", 1553430485, 5612123],
  ["20190324193006", 1553430606, 6046585],
  ["20190324193204", 1553430724, 6447130],
  ["20190324193404", 1553430844, 6854463],
  ["20190324193605", 1553430965, 7193056],
  ["20190324193705", 1553431025, 7396706],
  ["20190324193806", 1553431086, 7520415],
  ["20190324193905", 1553431145, 7734192],
  ["20190324194106", 1553431266, 8016268],
  ["20190324194205", 1553431325, 8026557],
  ["20190324194404", 1553431444, 8243946],
  ["20190324194505", 1553431505, 8562822],
  ["20190324194605", 1553431565, 8618147],
  ["20190324194705", 1553431625, 8852350],
  ["20190324194906", 1553431746, 9162223],
  ["20190324195006", 1553431806, 9238699],
  ["20190324195104", 1553431864, 9425161],
  ["20190324195206", 1553431926, 9481691],
  ["20190324195306", 1553431986, 9684824],
  ["20190324195405", 1553432045, 9795188],
  ["20190324195505", 1553432105, 9925674],
  ["20190324195706", 1553432226, 10124410],
  ["20190324195805", 1553432285, 10178645],
  ["20190324200005", 1553432405, 10410888],
  ["20190324200205", 1553432525, 10583765],
  ["20190324200305", 1553432585, 10687573],
  ["20190324200406", 1553432646, 10774754],
  ["20190324200505", 1553432705, 10836606],
  ["20190324200705", 1553432825, 11131831],
  ["20190324200905", 1553432945, 11710089],
  ["20190324201106", 1553433066, 11982205],
  ["20190324201305", 1553433185, 12383194],
  ["20190324201404", 1553433244, 12534629],
  ["20190324201506", 1553433306, 12670915],
  ["20190324201605", 1553433365, 12805367],
  ["20190324201804", 1553433484, 12913077],
  ["20190324201905", 1553433545, 13141289],
  ["20190324202005", 1553433605, 13312799],
  ["20190324202204", 1553433724, 13637095],
  ["20190324202405", 1553433845, 13880948],
  ["20190324202505", 1553433905, 14086502],
  ["20190324202605", 1553433965, 14202406],
  ["20190324202706", 1553434026, 14439776],
  ["20190324202906", 1553434146, 14853364],
  ["20190324203005", 1553434205, 14996537],
  ["20190324203105", 1553434265, 15202003],
  ["20190324203305", 1553434385, 15627419],
  ["20190324203406", 1553434446, 15652704],
  ["20190324203604", 1553434564, 16095099],
  ["20190324203805", 1553434685, 16341724],
  ["20190324203905", 1553434745, 16441396],
  ["20190324210605", 1553436365, 16529118],
  ["20190324210705", 1553436425, 16788948],
  ["20190324210805", 1553436485, 17096012],
  ["20190324211005", 1553436605, 17567044],
  ["20190324211105", 1553436665, 17858190],
  ["20190324211305", 1553436785, 18352098],
  ["20190324211406", 1553436846, 18451641],
  ["20190324211606", 1553436966, 18750448],
  ["20190324211806", 1553437086, 18953977],
  ["20190324211904", 1553437144, 19041119],
  ["20190324212005", 1553437205, 19140319],
  ["20190324212105", 1553437265, 19239359],
  ["20190324212204", 1553437324, 19311318],
  ["20190324212305", 1553437385, 19441289],
  ["20190324212405", 1553437445, 19530857],
  ["20190324212505", 1553437505, 19643911],
  ["20190324212705", 1553437625, 19917717],
  ["20190324212805", 1553437685, 20009931],
  ["20190324213005", 1553437805, 20474690],
  ["20190324213205", 1553437925, 20623625],
  ["20190324213306", 1553437986, 20765458],
  ["20190324213406", 1553438046, 20871776],
  ["20190324213605", 1553438165, 21017926],
  ["20190324213806", 1553438286, 21226542],
  ["20190324214004", 1553438404, 21340896],
  ["20190324214105", 1553438465, 21450978],
  ["20190324214304", 1553438584, 21625794],
  ["20190324214405", 1553438645, 21673999],
  ["20190324214506", 1553438706, 21730975],
  ["20190324214606", 1553438766, 21796988],
  ["20190324214905", 1553438945, 21875964],
  ["20190324215006", 1553439006, 22156002],
  ["20190324215205", 1553439125, 22345225],
  ["20190324215404", 1553439244, 22616082],
  ["20190324215605", 1553439365, 22823898],
  ["20190324215806", 1553439486, 23188122],
  ["20190324220006", 1553439606, 23634931],
  ["20190324220205", 1553439725, 23960599],
  ["20190324222829", 1553441309, 24430935],
  ["20190324222905", 1553441345, 24446663],
  ["20190324223005", 1553441405, 24462046],
  ["20190324223205", 1553441525, 24504057],
  ["20190324223306", 1553441586, 24519308],
  ["20190324223406", 1553441646, 24550811],
  ["20190324223605", 1553441765, 24563868],
  ["20190324223706", 1553441826, 24570289],
  ["20190324223905", 1553441945, 24670775],
  ["20190324224106", 1553442066, 24756910],
  ["20190324224305", 1553442185, 24779701],
  ["20190324224506", 1553442306, 24821897],
  ["20190324224605", 1553442365, 24914597],
  ["20190324224805", 1553442485, 24970793],
  ["20190324225006", 1553442606, 24989873],
  ["20190324225605", 1553442965, 25348198],
  ["20190324225707", 1553443027, 26353408],
  ["20190324225905", 1553443145, 28020522],
  ["20190324230105", 1553443265, 29562666],
  ["20190324230205", 1553443325, 30343864],
  ["20190324230404", 1553443444, 31788377],
  ["20190324230504", 1553443504, 31790414],
  ["20190324233206", 1553445126, 31803833],
  ["20190325095905", 1553482745, 33354459],
]
