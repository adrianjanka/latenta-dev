import { collectionExists, directusFetch } from './lib/directus'

async function createField(collection: string, field: Record<string, unknown>) {
  const fieldName = field.field as string
  try {
    await directusFetch(`/fields/${collection}/${fieldName}`)
    console.log(`  Feld ${collection}.${fieldName} existiert bereits`)
  }
  catch {
    await directusFetch(`/fields/${collection}`, {
      method: 'POST',
      body: JSON.stringify(field),
    })
    console.log(`  Feld ${collection}.${fieldName} erstellt`)
  }
}

async function setupStimmungsTags() {
  const name = 'stimmungs_tags'
  if (!(await collectionExists(name))) {
    await directusFetch('/collections', {
      method: 'POST',
      body: JSON.stringify({
        collection: name,
        meta: { icon: 'local_offer', note: 'Tags für Empfehlungslogik' },
        schema: { name },
        fields: [
          { field: 'id', type: 'uuid', meta: { hidden: true, readonly: true, interface: 'input', special: ['uuid'] }, schema: { is_primary_key: true } },
          { field: 'name', type: 'string', meta: { interface: 'input', required: true }, schema: { is_nullable: false } },
          { field: 'slug', type: 'string', meta: { interface: 'input', required: true }, schema: { is_nullable: false, is_unique: true } },
          {
            field: 'kategorie',
            type: 'string',
            meta: {
              interface: 'select-dropdown',
              required: true,
              options: { choices: [
                { text: 'Licht', value: 'licht' },
                { text: 'Stimmung', value: 'stimmung' },
                { text: 'Motiv', value: 'motiv' },
                { text: 'Ästhetik', value: 'aesthetik' },
              ] },
            },
            schema: { is_nullable: false },
          },
        ],
      }),
    })
    console.log(`Collection ${name} erstellt`)
  }
  else {
    console.log(`Collection ${name} existiert bereits`)
  }
}

async function setupFilmstocks() {
  const name = 'filmstocks'
  if (!(await collectionExists(name))) {
    await directusFetch('/collections', {
      method: 'POST',
      body: JSON.stringify({
        collection: name,
        meta: { icon: 'photo_camera', note: 'Analogfilm-Stocks' },
        schema: { name },
        fields: [
          { field: 'id', type: 'uuid', meta: { hidden: true, readonly: true, interface: 'input', special: ['uuid'] }, schema: { is_primary_key: true } },
          { field: 'name', type: 'string', meta: { interface: 'input', required: true }, schema: { is_nullable: false } },
          { field: 'hersteller', type: 'string', meta: { interface: 'input', required: true }, schema: { is_nullable: false } },
          { field: 'iso', type: 'integer', meta: { interface: 'input', required: true }, schema: { is_nullable: false } },
          {
            field: 'typ',
            type: 'string',
            meta: {
              interface: 'select-dropdown',
              required: true,
              options: { choices: [
                { text: 'Farbe', value: 'farbe' },
                { text: 'Schwarzweiss', value: 's_w' },
              ] },
            },
            schema: { is_nullable: false },
          },
          { field: 'format', type: 'json', meta: { interface: 'input-code', options: { language: 'json' } }, schema: {} },
          {
            field: 'koernung',
            type: 'string',
            meta: {
              interface: 'select-dropdown',
              options: { choices: [
                { text: 'Fein', value: 'fein' },
                { text: 'Mittel', value: 'mittel' },
                { text: 'Grob', value: 'grob' },
              ] },
            },
            schema: {},
          },
          { field: 'farbcharakter', type: 'text', meta: { interface: 'input-multiline' }, schema: {} },
          {
            field: 'kontrast',
            type: 'string',
            meta: {
              interface: 'select-dropdown',
              options: { choices: [
                { text: 'Niedrig', value: 'niedrig' },
                { text: 'Mittel', value: 'mittel' },
                { text: 'Hoch', value: 'hoch' },
              ] },
            },
            schema: {},
          },
          {
            field: 'belichtungstoleranz',
            type: 'string',
            meta: {
              interface: 'select-dropdown',
              options: { choices: [
                { text: 'Eng', value: 'eng' },
                { text: 'Normal', value: 'normal' },
                { text: 'Weit', value: 'weit' },
              ] },
            },
            schema: {},
          },
          { field: 'beschreibung', type: 'text', meta: { interface: 'input-multiline' }, schema: {} },
          { field: 'beschreibung_en', type: 'text', meta: { interface: 'input-multiline', note: 'Original EN' }, schema: {} },
          { field: 'bild', type: 'uuid', meta: { interface: 'file-image', special: ['file'], display: 'image' }, schema: {} },
          { field: 'bild_quelle', type: 'string', meta: { interface: 'input' }, schema: {} },
          { field: 'externe_quelle', type: 'string', meta: { interface: 'input' }, schema: {} },
          { field: 'externe_id', type: 'string', meta: { interface: 'input' }, schema: {} },
          {
            field: 'status',
            type: 'string',
            meta: {
              interface: 'select-dropdown',
              options: { choices: [
                { text: 'Entwurf', value: 'draft' },
                { text: 'Veröffentlicht', value: 'published' },
              ] },
            },
            schema: { default_value: 'draft' },
          },
        ],
      }),
    })
    console.log(`Collection ${name} erstellt`)
  }
  else {
    console.log(`Collection ${name} existiert bereits`)
  }

  await ensureBildFileRelation()
  await setupBeispielbilderFiles()

  // Junction-Collection zuerst (M2M braucht Junction + Relations vor dem Alias-Feld)
  const junction = 'filmstocks_stimmungs_tags'
  if (!(await collectionExists(junction))) {
    await directusFetch('/collections', {
      method: 'POST',
      body: JSON.stringify({
        collection: junction,
        meta: { hidden: true, icon: 'import_export' },
        schema: { name: junction },
        fields: [
          { field: 'id', type: 'integer', meta: { hidden: true, readonly: true, interface: 'input' }, schema: { is_primary_key: true, has_auto_increment: true } },
          { field: 'filmstocks_id', type: 'uuid', meta: { interface: 'select-dropdown-m2o', special: ['m2o'], hidden: true }, schema: {} },
          { field: 'stimmungs_tags_id', type: 'uuid', meta: { interface: 'select-dropdown-m2o', special: ['m2o'], hidden: true }, schema: {} },
        ],
      }),
    })

    await directusFetch('/relations', {
      method: 'POST',
      body: JSON.stringify({
        collection: junction,
        field: 'filmstocks_id',
        related_collection: 'filmstocks',
        meta: { one_field: 'stimmungs_tags', junction_field: 'stimmungs_tags_id' },
        schema: { on_delete: 'CASCADE' },
      }),
    })

    await directusFetch('/relations', {
      method: 'POST',
      body: JSON.stringify({
        collection: junction,
        field: 'stimmungs_tags_id',
        related_collection: 'stimmungs_tags',
        meta: { junction_field: 'filmstocks_id' },
        schema: { on_delete: 'CASCADE' },
      }),
    })
    console.log(`Junction ${junction} erstellt`)
  }

  // M2M-Alias-Feld nach Junction anlegen
  await createField(name, {
    field: 'stimmungs_tags',
    type: 'alias',
    meta: {
      interface: 'list-m2m',
      special: ['m2m'],
      options: {
        template: '{{stimmungs_tags_id.name}}',
      },
    },
  })
}

/** Junction-Meta reparieren falls Admin-UI «Relation nicht konfiguriert» zeigt */
async function repairM2mRelations() {
  const junction = 'filmstocks_stimmungs_tags'
  if (!(await collectionExists(junction))) return

  console.log('M2M-Relation prüfen/reparieren...')

  for (const [field, related] of [
    ['filmstocks_id', 'filmstocks'],
    ['stimmungs_tags_id', 'stimmungs_tags'],
  ] as const) {
    await directusFetch(`/fields/${junction}/${field}`, {
      method: 'PATCH',
      body: JSON.stringify({
        meta: { interface: 'select-dropdown-m2o', special: ['m2o'], hidden: true, width: 'half' },
      }),
    })
  }

  try {
    await directusFetch(`/relations/${junction}/filmstocks_id`, {
      method: 'PATCH',
      body: JSON.stringify({
        related_collection: 'filmstocks',
        meta: { one_field: 'stimmungs_tags', junction_field: 'stimmungs_tags_id', sort_field: null },
        schema: { on_delete: 'CASCADE' },
      }),
    })
  }
  catch {
    await directusFetch('/relations', {
      method: 'POST',
      body: JSON.stringify({
        collection: junction,
        field: 'filmstocks_id',
        related_collection: 'filmstocks',
        meta: { one_field: 'stimmungs_tags', junction_field: 'stimmungs_tags_id' },
        schema: { on_delete: 'CASCADE' },
      }),
    })
  }

  try {
    await directusFetch(`/relations/${junction}/stimmungs_tags_id`, {
      method: 'PATCH',
      body: JSON.stringify({
        related_collection: 'stimmungs_tags',
        meta: { junction_field: 'filmstocks_id', sort_field: null },
        schema: { on_delete: 'CASCADE' },
      }),
    })
  }
  catch {
    await directusFetch('/relations', {
      method: 'POST',
      body: JSON.stringify({
        collection: junction,
        field: 'stimmungs_tags_id',
        related_collection: 'stimmungs_tags',
        meta: { junction_field: 'filmstocks_id' },
        schema: { on_delete: 'CASCADE' },
      }),
    })
  }

  await directusFetch('/fields/filmstocks/stimmungs_tags', {
    method: 'PATCH',
    body: JSON.stringify({
      meta: {
        interface: 'list-m2m',
        special: ['m2m'],
        options: { template: '{{stimmungs_tags_id.name}}', enableCreate: false },
        display: 'related-values',
        display_options: { template: '{{stimmungs_tags_id.name}}' },
      },
    }),
  })
  console.log('M2M-Relation OK')
}

/** file-Relation für Rollenfoto (Admin-UI braucht FK auf directus_files) */
async function ensureBildFileRelation() {
  const parent = 'filmstocks'
  const field = 'bild'

  try {
    await directusFetch(`/relations/${parent}/${field}`)
    console.log(`Relation ${parent}.${field} → directus_files existiert bereits`)
  }
  catch {
    await directusFetch('/relations', {
      method: 'POST',
      body: JSON.stringify({
        collection: parent,
        field,
        related_collection: 'directus_files',
        meta: { one_field: null, sort_field: null, one_deselect_action: 'nullify' },
        schema: { on_delete: 'SET NULL' },
      }),
    })
    console.log(`Relation ${parent}.${field} → directus_files erstellt`)
  }

  await directusFetch(`/fields/${parent}/${field}`, {
    method: 'PATCH',
    body: JSON.stringify({
      meta: {
        interface: 'file-image',
        special: ['file'],
        display: 'image',
        display_options: { circle: false },
      },
    }),
  })
}

/** Files-Relation für Beispielaufnahmen (Look-Galerie) */
async function setupBeispielbilderFiles() {
  const parent = 'filmstocks'
  const field = 'beispielbilder'
  const junction = 'filmstocks_beispielbilder'

  if (!(await collectionExists(junction))) {
    await directusFetch('/collections', {
      method: 'POST',
      body: JSON.stringify({
        collection: junction,
        meta: { hidden: true, icon: 'import_export' },
        schema: { name: junction },
        fields: [
          {
            field: 'id',
            type: 'integer',
            meta: { hidden: true, readonly: true, interface: 'input' },
            schema: { is_primary_key: true, has_auto_increment: true },
          },
          {
            field: 'filmstocks_id',
            type: 'uuid',
            meta: { interface: 'select-dropdown-m2o', special: ['m2o'], hidden: true },
            schema: {},
          },
          {
            field: 'directus_files_id',
            type: 'uuid',
            meta: { interface: 'select-dropdown-m2o', special: ['m2o'], hidden: true },
            schema: {},
          },
        ],
      }),
    })
    console.log(`Junction ${junction} erstellt`)
  }
  else {
    console.log(`Junction ${junction} existiert bereits`)
  }

  try {
    await directusFetch(`/relations/${junction}/filmstocks_id`)
  }
  catch {
    await directusFetch('/relations', {
      method: 'POST',
      body: JSON.stringify({
        collection: junction,
        field: 'filmstocks_id',
        related_collection: parent,
        meta: { one_field: field, junction_field: 'directus_files_id' },
        schema: { on_delete: 'CASCADE' },
      }),
    })
  }

  try {
    await directusFetch(`/relations/${junction}/directus_files_id`)
  }
  catch {
    await directusFetch('/relations', {
      method: 'POST',
      body: JSON.stringify({
        collection: junction,
        field: 'directus_files_id',
        related_collection: 'directus_files',
        meta: { junction_field: 'filmstocks_id' },
        schema: { on_delete: 'CASCADE' },
      }),
    })
  }

  // Alias-Feld anlegen oder special: files nachziehen (MCP setzt special oft nicht)
  try {
    await directusFetch(`/fields/${parent}/${field}`)
    await directusFetch(`/fields/${parent}/${field}`, {
      method: 'PATCH',
      body: JSON.stringify({
        meta: {
          interface: 'files',
          special: ['files'],
          display: 'related-values',
          note: 'Beispielaufnahmen (Look) – Attribution in File-description',
        },
      }),
    })
    console.log(`Feld ${parent}.${field} aktualisiert (files)`)
  }
  catch {
    await createField(parent, {
      field,
      type: 'alias',
      meta: {
        interface: 'files',
        special: ['files'],
        display: 'related-values',
        note: 'Beispielaufnahmen (Look) – Attribution in File-description',
      },
    })
  }
}

async function setupEntwicklungsrezepte() {
  const name = 'entwicklungsrezepte'
  if (await collectionExists(name)) {
    console.log(`Collection ${name} existiert bereits`)
    return
  }

  await directusFetch('/collections', {
    method: 'POST',
    body: JSON.stringify({
      collection: name,
      meta: { icon: 'science', note: 'Phase 3 – noch nicht befüllt' },
      schema: { name },
      fields: [
        { field: 'id', type: 'uuid', meta: { hidden: true, special: ['uuid'] }, schema: { is_primary_key: true } },
        { field: 'entwickler', type: 'string', meta: { interface: 'input', required: true }, schema: { is_nullable: false } },
        { field: 'verduennung', type: 'string', meta: { interface: 'input' }, schema: {} },
        { field: 'temperatur', type: 'float', meta: { interface: 'input' }, schema: {} },
        { field: 'zeit_sekunden', type: 'integer', meta: { interface: 'input' }, schema: {} },
        { field: 'agitation', type: 'text', meta: { interface: 'input-multiline' }, schema: {} },
        { field: 'schritte', type: 'json', meta: { interface: 'input-code', options: { language: 'json' } }, schema: {} },
        { field: 'quelle', type: 'string', meta: { interface: 'input', required: true }, schema: { is_nullable: false } },
        {
          field: 'status',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: { choices: [
              { text: 'Entwurf', value: 'draft' },
              { text: 'Veröffentlicht', value: 'published' },
            ] },
          },
          schema: { default_value: 'draft' },
        },
      ],
    }),
  })

  await createField(name, {
    field: 'filmstock',
    type: 'uuid',
    meta: { interface: 'select-dropdown-m2o', special: ['m2o'] },
    schema: {},
  })

  await directusFetch('/relations', {
    method: 'POST',
    body: JSON.stringify({
      collection: name,
      field: 'filmstock',
      related_collection: 'filmstocks',
      schema: { on_delete: 'SET NULL' },
    }),
  })

  console.log(`Collection ${name} erstellt`)
}

async function main() {
  console.log('Directus-Schema einrichten...')
  await setupStimmungsTags()
  await setupFilmstocks()
  await repairM2mRelations()
  await setupEntwicklungsrezepte()
  console.log('Fertig.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
