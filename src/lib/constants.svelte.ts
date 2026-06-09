export type TraitObj = {
	traitKey?: string | undefined;
	traitName?: string | undefined;
};

export const BLANK_TRAIT: TraitObj = {
	traitKey: undefined,
	traitName: undefined,
};

export const NAME_TRAIT: TraitObj = {
	traitKey: "name",
	traitName: "Name",
};

export const ARTIST_TRAIT: TraitObj = {
	traitKey: "artist",
	traitName: "Artist",
};

export const ALBUM_TRAIT: TraitObj = {
	traitKey: "album",
	traitName: "Album",
};

export const LENGTH_TRAIT: TraitObj = {
	traitKey: "length",
	traitName: "Length",
};

export const DATE_ADDED_TRAIT: TraitObj = {
	traitKey: "dateAdded",
	traitName: "Date Added",
};

export type SortObj = {
	trait: TraitObj;
	reversed?: boolean;
};

export type GroupObj = SortObj & {
	groupBy: "firstLetter" | "firstWord" | "exact";
};

export type orderComponentObj = SortObj | GroupObj;
