name="$1"

if [[ -z "$1" ]]; then
    echo "pass the name of the content type as the first parameter"
    exit 1
fi

read -d '' controller_source <<EOF
'use strict';

/**
 *  NAME controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::NAME.NAME');

EOF

read -d '' route_source <<EOF
'use strict';

/**
 * NAME router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::NAME.NAME');

EOF

read -d '' service_source <<EOF
'use strict';

/**
 * NAME service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::NAME.NAME');

EOF

write_source() {
    source="$1"
    source_name="$2"
    out="$(echo "$source" | sed -r "s/NAME/$name/g")"
    base_path="$(realpath $(dirname $(realpath "$0"))/../projects/bp-strapi/src/api/$name/$2/$name)"
    path="$base_path.js"
    echo "$out" > "$path"
    ts_path="$base_path.ts"
    if [[ -f "$ts_path" ]]; then
        rm "$ts_path"
    fi
}

write_source "$controller_source" "controllers"
write_source "$route_source" "routes"
write_source "$service_source" "services"
