<template>
  <b-container fluid="lg">
    <div class="m-auto">
      <card :title="'Vous étes connectés'" style="margin-top: 15px;">
        <p>Le module JavaScript face-api.js impl&eacute;mente des r&eacute;seaux de neurones convolutifs pour r&eacute;soudre la d&eacute;tections et la reconnaissance des visages ainsi que la reconnaissance des rep&egrave;res faciaux. L&#39;api face-api.js exploite <a href="https://www.infoq.com/news/2018/04/tensorflow-javascript-browser/">TensorFlow.js</a> et est optimis&eacute; pour le bureau et le web mobile.</p>
        <div class="blockquote">
          <p><fa icon="quote-left" fixed-width />    Pour rester simple, ce que nous voulons r&eacute;ellement r&eacute;aliser, c&#39;est identifier une personne donn&eacute;e &agrave; partir d&#39;une image de son visage, par exemple&nbsp;l&#39;image d&#39;entr&eacute;e. La mani&egrave;re de proc&eacute;der, est de fournir une (ou plusieurs) image(s) pour chaque personne que nous voulons reconna&icirc;tre, avec leur nom, par exemple&nbsp;les donn&eacute;es de r&eacute;f&eacute;rences. Maintenant nous comparons l&#39;image d&#39;entr&eacute;e aux donn&eacute;es de r&eacute;f&eacute;rences et trouvons l&#39;image de r&eacute;f&eacute;rence la plus similaire. Si les deux images sont suffisamment similaires, nous donnons le nom de la personne, sinon nous affichons &quot;inconnu&quot;. &Ccedil;a parait &ecirc;tre un bon plan! Toutefois, deux probl&egrave;mes persistent. Premi&egrave;rement, que se passe t-il si nous avons une image sur laquelle plusieurs personnes apparaissent, et que nous souhaitons toutes les reconna&icirc;tre? Deuxi&egrave;mement, nous devons &ecirc;tre en mesure d&#39;obtenir une sorte de mesure de similarit&eacute; pour deux images de visages afin de les comparer...   <fa icon="quote-right" fixed-width /></p>
        </div>
        <p>Il existe plusieurs mod&egrave;les disponible avec face-api.js, incluant la d&eacute;tection de visage, la d&eacute;tection de rep&egrave;re de visage, la reconnaissance faciale, la reconnaissance d&#39;expression faciale, l&#39;estimation de l&#39;&acirc;ge et la reconnaissance du genre.</p>
        <p style="text-align: center"><img _href="img://1vincentFaceDetection-1584401191049.gif" alt="Face Detection of face-api.js creator" data-src="news/2020/03/face-api-js/en/resources/1vincentFaceDetection-1584401191049.gif"  style="width: 660px; height: 440px;"  src="https://res.infoq.com/news/2020/03/face-api-js/en/resources/1vincentFaceDetection-1584401191049.gif" rel="share"></p>
        Face Detection of face-api.js creator

        Pour commencer avec l'api face-api.js, les développeurs peuvent inclure la dernière ressource JavaScript de face-api.js.

        <p>Les d&eacute;veloppeurs chargent les diff&eacute;rentes instances de r&eacute;seau neuronal via faceapis.nets et chargent de mani&egrave;re asynchrone un mod&egrave;le, une map de tenseur nomm&eacute;e (named tensor map) ou des mod&egrave;les non compress&eacute;s avec un poids en <code>Float32Array</code>.</p>

        <p>Les versions r&eacute;centes de face-api.js ont conserv&eacute; leur coh&eacute;rence avec les derni&egrave;res versions de TensorFlow.js, en affinant et d&eacute;pr&eacute;ciant certaines APIs &agrave; mesure que le projet se rapproche d&#39;une version 1.0.</p>

        <p>La <a href="https://justadudewhohacks.github.io/face-api.js/docs/globals.html">documentation compl&egrave;te de l&#39;API face-api.js</a> est disponible, ainsi que <a href="https://github.com/justadudewhohacks/face-api.js">plusieurs exemples</a>.</p>

        <p>Le projet face-api.js est un logiciel open source disponible sous licence du MIT. Les contributions sont les bienvenues sur le <a href="https://github.com/justadudewhohacks/face-api.js">d&eacute;p&ocirc;t GitHub de face-api.js.</a>.</p>

      </card>
    </div>
  </b-container>
</template>

<script>
export default {
  layout: 'standard',

  metaInfo () {
    return { title: this.$t('home') }
  }
}
</script>
