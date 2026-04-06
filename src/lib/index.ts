// @omnidea/ui — Main barrel export (Solid.js)

// ── Theme ──
export { Theme } from './theme/Theme.js';
export { useTheme, themeMode, themeAspect, themeConfig, themeCrystal, isCrystalMode, hasCrystal } from './theme/context.js';
export type { ThemeContext } from './theme/context.js';
export { requestCrystalRender } from './theme/render-loop.js';

// ── Layout ──
export { Stack } from './layout/Stack.js';
export { Grid } from './layout/Grid.js';
export { Container } from './layout/Container.js';
export { Section } from './layout/Section.js';

// ── Atoms ──
export { Icon } from './atoms/Icon.js';
export { Spinner } from './atoms/Spinner.js';
export { Divider } from './atoms/Divider.js';
export { Badge } from './atoms/Badge.js';
export { Avatar } from './atoms/Avatar.js';
export { Image } from './atoms/Image.js';
export { Checkbox } from './atoms/Checkbox.js';
export { Tag } from './atoms/Tag.js';
export { Link } from './atoms/Link.js';
export { Skeleton } from './atoms/Skeleton.js';
export { EmptyState } from './atoms/EmptyState.js';
export { VoteGroup } from './atoms/VoteGroup.js';
export { StatGroup } from './atoms/StatGroup.js';

// ── Components ──
export { Button } from './components/Button.js';
export { Card } from './components/Card.js';
export { Input } from './components/Input.js';
export { TextArea } from './components/TextArea.js';
export { Select } from './components/Select.js';
export { Toggle } from './components/Toggle.js';
export { Modal } from './components/Modal.js';
export { Dropdown } from './components/Dropdown.js';
export { Tooltip } from './components/Tooltip.js';
export { Tabs } from './components/Tabs.js';
export { Accordion } from './components/Accordion.js';
export { ImageSlider } from './components/ImageSlider.js';
export { Sidebar } from './components/Sidebar.js';
export { SearchBar } from './components/SearchBar.js';
export { Breadcrumb } from './components/Breadcrumb.js';
export { TreeView } from './components/TreeView.js';
export type { TreeNode } from './components/TreeView.js';
export { Toolbar } from './components/Toolbar.js';
export { ContextMenu } from './components/ContextMenu.js';
export { Popover } from './components/Popover.js';
export { Toast, toast, dismiss } from './components/Toast.js';
export type { ToastMessage } from './components/Toast.js';
export { ConfirmDialog } from './components/ConfirmDialog.js';
export { List } from './components/List.js';
export type { ListItemData } from './components/List.js';

// ── Social ──
export { ReactionBar } from './components/ReactionBar.js';
export { SortBar } from './components/SortBar.js';
export { PostCard } from './components/PostCard.js';
export type { PostAuthor } from './components/PostCard.js';
export { ComposeBox } from './components/ComposeBox.js';
export { CommentNode } from './components/CommentNode.js';
export type { CommentNodeProps } from './components/CommentNode.js';
export { CommentThread } from './components/CommentThread.js';
export type { Comment } from './components/CommentThread.js';
export { ProfileHeader } from './components/ProfileHeader.js';
export { CollectiveHeader } from './components/CollectiveHeader.js';
export { FeedLayout } from './components/FeedLayout.js';
export { RepostCard } from './components/RepostCard.js';
export { NotificationItem } from './components/NotificationItem.js';

// ── Crystal ──
export { GlassPane } from './crystal/GlassPane.js';
export { GlassCard } from './crystal/GlassCard.js';

// ── Tokens ──
export type {
  Ember,
  Crest,
  Span,
  Glyph,
  Inscription,
  Arch,
  Shadow,
  Umbra,
  GlassElevation,
  GlassShadowAspect,
  NeuShadows,
  ThemeMode,
  Aspect,
  Aura,
  ThemeConfig,
  DeepPartial,
  ThemeOverrides,
} from './tokens/types.js';

export { defaults as defaultTokens } from './tokens/defaults.js';
export { mergeTheme } from './tokens/merge.js';
export { tokensToCSSVars, emberToHex } from './tokens/css.js';

// ── Internal utilities (exported for advanced use) ──
export { modeClass } from './internal/mode-styles.js';
