import type { StructureResolver } from 'sanity/structure';
import {
  HomeIcon,
  DocumentIcon,
  CogIcon,
  EarthGlobeIcon,
  ComposeIcon,
  MenuIcon,
  StackCompactIcon,
} from '@sanity/icons';
import { labels } from './i18n';

const l = labels.documents;
const s = labels.structure;

export const structure: StructureResolver = (S) => {
  const handledTypes = [
    'page',
    'siteSettings',
    'themeSettings',
    'header',
    'footer',
  ];

  const singletonIds = {
    homepage: 'homepage',
    imprint: 'imprint',
    privacy: 'privacy',
    siteSettings: 'siteSettings',
    themeSettings: 'themeSettings',
    header: 'header',
    footer: 'footer',
  };

  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .id('homepage')
        .title(s.homepage)
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('page')
            .documentId(singletonIds.homepage)
            .title(s.homepage)
        ),

      S.divider(),

      S.listItem()
        .id('pages')
        .title(l.page.title)
        .icon(DocumentIcon)
        .child(
          S.list()
            .title(l.page.title)
            .items([
              S.listItem()
                .id('all-pages')
                .title(s.allPages)
                .child(
                  S.documentList()
                    .title(s.allPages)
                    .filter(
                      `_type == "page" && !(_id in [${JSON.stringify(singletonIds.homepage)}, ${JSON.stringify(singletonIds.imprint)}, ${JSON.stringify(singletonIds.privacy)}])`
                    )
                ),

              S.divider(),

              S.listItem()
                .id('imprint')
                .title(s.imprint)
                .child(
                  S.document()
                    .schemaType('page')
                    .documentId(singletonIds.imprint)
                    .title(s.imprint)
                ),

              S.listItem()
                .id('privacy')
                .title(s.privacy)
                .child(
                  S.document()
                    .schemaType('page')
                    .documentId(singletonIds.privacy)
                    .title(s.privacy)
                ),
            ])
        ),

      S.divider(),

      S.listItem()
        .id('settings')
        .title(s.settings)
        .icon(CogIcon)
        .child(
          S.list()
            .title(s.settings)
            .items([
              S.listItem()
                .id('siteSettings')
                .title(l.siteSettings.title)
                .icon(EarthGlobeIcon)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId(singletonIds.siteSettings)
                    .title(l.siteSettings.title)
                ),

              S.listItem()
                .id('themeSettings')
                .title(l.themeSettings.title)
                .icon(ComposeIcon)
                .child(
                  S.document()
                    .schemaType('themeSettings')
                    .documentId(singletonIds.themeSettings)
                    .title(l.themeSettings.title)
                ),

              S.listItem()
                .id('header')
                .title(l.header.title)
                .icon(MenuIcon)
                .child(
                  S.document()
                    .schemaType('header')
                    .documentId(singletonIds.header)
                    .title(l.header.title)
                ),

              S.listItem()
                .id('footer')
                .title(l.footer.title)
                .icon(StackCompactIcon)
                .child(
                  S.document()
                    .schemaType('footer')
                    .documentId(singletonIds.footer)
                    .title(l.footer.title)
                ),
            ])
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !handledTypes.includes(listItem.getId() || '')
      ),
    ]);
};
