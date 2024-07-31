import { ColorSwatch } from "@mantine/core"

const DetailsColor = ({ color }) => {
    switch (color) {
        case "red":
            return <ColorSwatch color="#a81e23" />
        case "light blue":
            return <ColorSwatch color="#4e93cc" />
        case "green":
            return <ColorSwatch color="#2e5737" />
        case "navy blue":
            return <ColorSwatch color="#1d1f63" />
        case "black":
            return <ColorSwatch color="#0f0f0f" />
        case "grey":
            return <ColorSwatch color="#736f6f" />
        default: 
            return <ColorSwatch/>
    }
}

export default DetailsColor;