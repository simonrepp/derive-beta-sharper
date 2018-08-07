const layout = require('./layout.js');

module.exports = data => {
  const sortedFeatures = Array.from(data.features.values()).sort((a, b) => a.position - b.position);

  const html = `
    <div class="features">
      ${sortedFeatures.map(feature => `
        <div class="feature_split feature__${feature.type}">
          <div class="feature_image"
               ${feature.image ? ` style="background-image: url(${feature.image.written});"` : ''} >
          </div>

          <div class="feature_text">
            ${feature.header ? `
              <div class="generic__serif">
                ${feature.header}
              </div>
            `:''}

            <div class="generic__heading">
              <a href="${feature.url}">
                ${feature.title}
              </a>
            </div>

            ${feature.text ? feature.text.converted : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  return layout(data, html);
};
