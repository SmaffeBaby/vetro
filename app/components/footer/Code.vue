<script lang="ts">
import { defineComponent, h } from 'vue'
import { parseFooterCode, footerYearText } from '#shared/utils/footer-code'
import type { FooterCodeNode } from '#shared/types/footer'

export default defineComponent({
  props: { code: { type: String, required: true }, year: { type: Number, required: true } },
  setup(props) {
    function render(node: FooterCodeNode): ReturnType<typeof h> | string {
      if (!node.tag) return footerYearText(node.text || '', props.year)
      return h(node.tag, { href: node.href, title: node.title, target: node.target, rel: node.target === '_blank' ? 'noopener noreferrer' : undefined }, node.children?.map(render))
    }
    return () => {
      try { return h('div', { class: 'footer-code' }, parseFooterCode(props.code).map(render)) }
      catch { return h('span', props.code) }
    }
  }
})
</script>
