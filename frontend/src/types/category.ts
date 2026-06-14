export interface Category {
  id: string;

  name: string;

  slug: string;

  description: string;

  image: string;

  parentId?: string | null;

  metaTitle?: string;

  metaDescription?: string;

  metaKeywords?: string;

  active: boolean;
}