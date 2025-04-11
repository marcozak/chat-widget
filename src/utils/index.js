import BatteryIcon from '@/components/icons/BatteryIcon.vue'
import LeafIcon from '@/components/icons/LeafIcon.vue'
import PlugIcon from '@/components/icons/PlugIcon.vue'
import SavingsIcon from '@/components/icons/SavingsIcon.vue'
import ShieldIcon from '@/components/icons/ShieldIcon.vue'
import SparkIcon from '@/components/icons/SparkIcon.vue'
import SunIcon from '@/components/icons/SunIcon.vue'
import ThumbIcon from '@/components/icons/ThumbIcon.vue'

export const getIcon = (iconName) => {
    switch (iconName) {
        case "BatteryIcon":
        return BatteryIcon
        case "LeafIcon":
        return LeafIcon
        case "PlugIcon":
        return PlugIcon
        case "SavingsIcon":
        return SavingsIcon
        case "ShieldIcon":
        return ShieldIcon
        case "SparkIcon":
        return SparkIcon
        case "SunIcon":
        return SunIcon
        case "ThumbIcon":
        return ThumbIcon
    }
}