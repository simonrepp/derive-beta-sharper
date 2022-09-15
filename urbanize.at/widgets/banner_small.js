const { URBANIZE_YEAR } = require('../config.js');

module.exports = variant => `
    <div>
        <div class="banner_small banner_small_${variant}">
            <a class="logo_wrapper" href="/">
                <img class="logo_static" src="/images/urbanize_static_${variant}.svg">
            </a>
            <img alt="Around the Corner" class="slogan" src="/images/slogan_${variant === 'white' ? 'yellow' : variant}.svg">
            <div class="info font_size_1_2 font_weight_500">
                4—9 OKT ${URBANIZE_YEAR}<br>
                WIEN
            </div>
        </div>
    </div>
`;
