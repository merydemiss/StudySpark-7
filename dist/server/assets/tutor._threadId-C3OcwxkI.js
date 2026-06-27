import { n as useServerFn } from "./createSsrRpc-CFvjpL_S.js";
import { t as supabase } from "./client-WeurdN5J.js";
import { t as Route } from "./tutor._threadId-CBid0vXf.js";
import { a as updateThreadDifficulty, r as getThreadMessages } from "./threads.functions-Ue6AVtZ3.js";
import * as React from "react";
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { DefaultChatTransport } from "ai";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownIcon, BookOpen, CornerDownLeftIcon, Loader2Icon, Sparkles, SquareIcon, XIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { Streamdown } from "streamdown";
import { nanoid } from "nanoid";
import { motion } from "motion/react";
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9",
			"icon-sm": "h-8 w-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region src/components/ai-elements/conversation.tsx
var Conversation = ({ className, ...props }) => /* @__PURE__ */ jsx(StickToBottom, {
	className: cn("relative flex-1 overflow-y-hidden", className),
	initial: "smooth",
	resize: "smooth",
	role: "log",
	...props
});
var ConversationContent = ({ className, ...props }) => /* @__PURE__ */ jsx(StickToBottom.Content, {
	className: cn("flex flex-col gap-8 p-4", className),
	...props
});
var ConversationEmptyState = ({ className, title = "No messages yet", description = "Start a conversation to see messages here", icon, children, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex size-full flex-col items-center justify-center gap-3 p-8 text-center", className),
	...props,
	children: children ?? /* @__PURE__ */ jsxs(Fragment, { children: [icon && /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: icon
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ jsx("h3", {
			className: "font-medium text-sm",
			children: title
		}), description && /* @__PURE__ */ jsx("p", {
			className: "text-muted-foreground text-sm",
			children: description
		})]
	})] })
});
var ConversationScrollButton = ({ className, ...props }) => {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext();
	const handleScrollToBottom = useCallback(() => {
		scrollToBottom();
	}, [scrollToBottom]);
	return !isAtBottom && /* @__PURE__ */ jsx(Button, {
		className: cn("absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full dark:bg-background dark:hover:bg-muted", className),
		onClick: handleScrollToBottom,
		size: "icon",
		type: "button",
		variant: "outline",
		...props,
		children: /* @__PURE__ */ jsx(ArrowDownIcon, { className: "size-4" })
	});
};
//#endregion
//#region src/components/ai-elements/message.tsx
var Message = ({ className, from, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("group flex w-full max-w-[95%] flex-col gap-2", from === "user" ? "is-user ml-auto justify-end" : "is-assistant", className),
	...props
});
var MessageContent = ({ children, className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm", "group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground", "group-[.is-assistant]:text-foreground", className),
	...props,
	children
});
createContext(null);
var streamdownPlugins = {
	cjk,
	code,
	math,
	mermaid
};
var MessageResponse = memo(({ className, ...props }) => /* @__PURE__ */ jsx(Streamdown, {
	className: cn("size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className),
	plugins: streamdownPlugins,
	...props
}), (prevProps, nextProps) => prevProps.children === nextProps.children && nextProps.isAnimating === prevProps.isAnimating);
MessageResponse.displayName = "MessageResponse";
//#endregion
//#region src/components/ui/textarea.tsx
var Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
//#region src/components/ui/input-group.tsx
function InputGroup({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "input-group",
		role: "group",
		className: cn("group/input-group border-input dark:bg-input/30 shadow-xs relative flex w-full items-center rounded-md border outline-none transition-[color,box-shadow]", "h-9 has-[>textarea]:h-auto", "has-[>[data-align=inline-start]]:[&>input]:pl-2", "has-[>[data-align=inline-end]]:[&>input]:pr-2", "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3", "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3", "has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1", "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40", className),
		...props
	});
}
var inputGroupAddonVariants = cva("text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4", {
	variants: { align: {
		"inline-start": "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
		"inline-end": "order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]",
		"block-start": "[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5",
		"block-end": "[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5"
	} },
	defaultVariants: { align: "inline-start" }
});
function InputGroupAddon({ className, align = "inline-start", ...props }) {
	return /* @__PURE__ */ jsx("div", {
		role: "group",
		"data-slot": "input-group-addon",
		"data-align": align,
		className: cn(inputGroupAddonVariants({ align }), className),
		onClick: (e) => {
			if (e.target.closest("button")) return;
			e.currentTarget.parentElement?.querySelector("input")?.focus();
		},
		...props
	});
}
var inputGroupButtonVariants = cva("flex items-center gap-2 text-sm shadow-none", {
	variants: { size: {
		xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
		sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
		"icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
		"icon-sm": "size-8 p-0 has-[>svg]:p-0"
	} },
	defaultVariants: { size: "xs" }
});
function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ...props }) {
	return /* @__PURE__ */ jsx(Button, {
		type,
		"data-size": size,
		variant,
		className: cn(inputGroupButtonVariants({ size }), className),
		...props
	});
}
function InputGroupTextarea({ className, ...props }) {
	return /* @__PURE__ */ jsx(Textarea, {
		"data-slot": "input-group-control",
		className: cn("flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent", className),
		...props
	});
}
//#endregion
//#region src/components/ui/spinner.tsx
function Spinner({ className, ...props }) {
	return /* @__PURE__ */ jsx(Loader2Icon, {
		role: "status",
		"aria-label": "Loading",
		className: cn("size-4 animate-spin", className),
		...props
	});
}
//#endregion
//#region src/components/ai-elements/prompt-input.tsx
var convertBlobUrlToDataUrl = async (url) => {
	try {
		const blob = await (await fetch(url)).blob();
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = () => resolve(null);
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
};
var PromptInputController = createContext(null);
var ProviderAttachmentsContext = createContext(null);
var useOptionalPromptInputController = () => useContext(PromptInputController);
var useOptionalProviderAttachments = () => useContext(ProviderAttachmentsContext);
var LocalAttachmentsContext = createContext(null);
var usePromptInputAttachments = () => {
	const provider = useOptionalProviderAttachments();
	const context = useContext(LocalAttachmentsContext) ?? provider;
	if (!context) throw new Error("usePromptInputAttachments must be used within a PromptInput or PromptInputProvider");
	return context;
};
var LocalReferencedSourcesContext = createContext(null);
var PromptInput = ({ className, accept, multiple, globalDrop, syncHiddenInput, maxFiles, maxFileSize, onError, onSubmit, children, ...props }) => {
	const controller = useOptionalPromptInputController();
	const usingProvider = !!controller;
	const inputRef = useRef(null);
	const formRef = useRef(null);
	const [items, setItems] = useState([]);
	const files = usingProvider ? controller.attachments.files : items;
	const [referencedSources, setReferencedSources] = useState([]);
	const filesRef = useRef(files);
	useEffect(() => {
		filesRef.current = files;
	}, [files]);
	const openFileDialogLocal = useCallback(() => {
		inputRef.current?.click();
	}, []);
	const matchesAccept = useCallback((f) => {
		if (!accept || accept.trim() === "") return true;
		return accept.split(",").map((s) => s.trim()).filter(Boolean).some((pattern) => {
			if (pattern.endsWith("/*")) {
				const prefix = pattern.slice(0, -1);
				return f.type.startsWith(prefix);
			}
			return f.type === pattern;
		});
	}, [accept]);
	const addLocal = useCallback((fileList) => {
		const incoming = [...fileList];
		const accepted = incoming.filter((f) => matchesAccept(f));
		if (incoming.length && accepted.length === 0) {
			onError?.({
				code: "accept",
				message: "No files match the accepted types."
			});
			return;
		}
		const withinSize = (f) => maxFileSize ? f.size <= maxFileSize : true;
		const sized = accepted.filter(withinSize);
		if (accepted.length > 0 && sized.length === 0) {
			onError?.({
				code: "max_file_size",
				message: "All files exceed the maximum size."
			});
			return;
		}
		setItems((prev) => {
			const capacity = typeof maxFiles === "number" ? Math.max(0, maxFiles - prev.length) : void 0;
			const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized;
			if (typeof capacity === "number" && sized.length > capacity) onError?.({
				code: "max_files",
				message: "Too many files. Some were not added."
			});
			const next = [];
			for (const file of capped) next.push({
				filename: file.name,
				id: nanoid(),
				mediaType: file.type,
				type: "file",
				url: URL.createObjectURL(file)
			});
			return [...prev, ...next];
		});
	}, [
		matchesAccept,
		maxFiles,
		maxFileSize,
		onError
	]);
	const removeLocal = useCallback((id) => setItems((prev) => {
		const found = prev.find((file) => file.id === id);
		if (found?.url) URL.revokeObjectURL(found.url);
		return prev.filter((file) => file.id !== id);
	}), []);
	const addWithProviderValidation = useCallback((fileList) => {
		const incoming = [...fileList];
		const accepted = incoming.filter((f) => matchesAccept(f));
		if (incoming.length && accepted.length === 0) {
			onError?.({
				code: "accept",
				message: "No files match the accepted types."
			});
			return;
		}
		const withinSize = (f) => maxFileSize ? f.size <= maxFileSize : true;
		const sized = accepted.filter(withinSize);
		if (accepted.length > 0 && sized.length === 0) {
			onError?.({
				code: "max_file_size",
				message: "All files exceed the maximum size."
			});
			return;
		}
		const currentCount = files.length;
		const capacity = typeof maxFiles === "number" ? Math.max(0, maxFiles - currentCount) : void 0;
		const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized;
		if (typeof capacity === "number" && sized.length > capacity) onError?.({
			code: "max_files",
			message: "Too many files. Some were not added."
		});
		if (capped.length > 0) controller?.attachments.add(capped);
	}, [
		matchesAccept,
		maxFileSize,
		maxFiles,
		onError,
		files.length,
		controller
	]);
	const clearAttachments = useCallback(() => usingProvider ? controller?.attachments.clear() : setItems((prev) => {
		for (const file of prev) if (file.url) URL.revokeObjectURL(file.url);
		return [];
	}), [usingProvider, controller]);
	const clearReferencedSources = useCallback(() => setReferencedSources([]), []);
	const add = usingProvider ? addWithProviderValidation : addLocal;
	const remove = usingProvider ? controller.attachments.remove : removeLocal;
	const openFileDialog = usingProvider ? controller.attachments.openFileDialog : openFileDialogLocal;
	const clear = useCallback(() => {
		clearAttachments();
		clearReferencedSources();
	}, [clearAttachments, clearReferencedSources]);
	useEffect(() => {
		if (!usingProvider) return;
		controller.__registerFileInput(inputRef, () => inputRef.current?.click());
	}, [usingProvider, controller]);
	useEffect(() => {
		if (syncHiddenInput && inputRef.current && files.length === 0) inputRef.current.value = "";
	}, [files, syncHiddenInput]);
	useEffect(() => {
		const form = formRef.current;
		if (!form) return;
		if (globalDrop) return;
		const onDragOver = (e) => {
			if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
		};
		const onDrop = (e) => {
			if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
			if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) add(e.dataTransfer.files);
		};
		form.addEventListener("dragover", onDragOver);
		form.addEventListener("drop", onDrop);
		return () => {
			form.removeEventListener("dragover", onDragOver);
			form.removeEventListener("drop", onDrop);
		};
	}, [add, globalDrop]);
	useEffect(() => {
		if (!globalDrop) return;
		const onDragOver = (e) => {
			if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
		};
		const onDrop = (e) => {
			if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
			if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) add(e.dataTransfer.files);
		};
		document.addEventListener("dragover", onDragOver);
		document.addEventListener("drop", onDrop);
		return () => {
			document.removeEventListener("dragover", onDragOver);
			document.removeEventListener("drop", onDrop);
		};
	}, [add, globalDrop]);
	useEffect(() => () => {
		if (!usingProvider) {
			for (const f of filesRef.current) if (f.url) URL.revokeObjectURL(f.url);
		}
	}, [usingProvider]);
	const handleChange = useCallback((event) => {
		if (event.currentTarget.files) add(event.currentTarget.files);
		event.currentTarget.value = "";
	}, [add]);
	const attachmentsCtx = useMemo(() => ({
		add,
		clear: clearAttachments,
		fileInputRef: inputRef,
		files: files.map((item) => ({
			...item,
			id: item.id
		})),
		openFileDialog,
		remove
	}), [
		files,
		add,
		remove,
		clearAttachments,
		openFileDialog
	]);
	const refsCtx = useMemo(() => ({
		add: (incoming) => {
			const array = Array.isArray(incoming) ? incoming : [incoming];
			setReferencedSources((prev) => [...prev, ...array.map((s) => ({
				...s,
				id: nanoid()
			}))]);
		},
		clear: clearReferencedSources,
		remove: (id) => {
			setReferencedSources((prev) => prev.filter((s) => s.id !== id));
		},
		sources: referencedSources
	}), [referencedSources, clearReferencedSources]);
	const handleSubmit = useCallback(async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const text = usingProvider ? controller.textInput.value : (() => {
			return new FormData(form).get("message") || "";
		})();
		if (!usingProvider) form.reset();
		try {
			const result = onSubmit({
				files: await Promise.all(files.map(async ({ id: _id, ...item }) => {
					if (item.url?.startsWith("blob:")) {
						const dataUrl = await convertBlobUrlToDataUrl(item.url);
						return {
							...item,
							url: dataUrl ?? item.url
						};
					}
					return item;
				})),
				text
			}, event);
			if (result instanceof Promise) try {
				await result;
				clear();
				if (usingProvider) controller.textInput.clear();
			} catch {}
			else {
				clear();
				if (usingProvider) controller.textInput.clear();
			}
		} catch {}
	}, [
		usingProvider,
		controller,
		files,
		onSubmit,
		clear
	]);
	const inner = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("input", {
		accept,
		"aria-label": "Upload files",
		className: "hidden",
		multiple,
		onChange: handleChange,
		ref: inputRef,
		title: "Upload files",
		type: "file"
	}), /* @__PURE__ */ jsx("form", {
		className: cn("w-full", className),
		onSubmit: handleSubmit,
		ref: formRef,
		...props,
		children: /* @__PURE__ */ jsx(InputGroup, {
			className: "overflow-hidden",
			children
		})
	})] });
	const withReferencedSources = /* @__PURE__ */ jsx(LocalReferencedSourcesContext.Provider, {
		value: refsCtx,
		children: inner
	});
	return /* @__PURE__ */ jsx(LocalAttachmentsContext.Provider, {
		value: attachmentsCtx,
		children: withReferencedSources
	});
};
var PromptInputTextarea = ({ onChange, onKeyDown, className, placeholder = "What would you like to know?", ...props }) => {
	const controller = useOptionalPromptInputController();
	const attachments = usePromptInputAttachments();
	const [isComposing, setIsComposing] = useState(false);
	const handleKeyDown = useCallback((e) => {
		onKeyDown?.(e);
		if (e.defaultPrevented) return;
		if (e.key === "Enter") {
			if (isComposing || e.nativeEvent.isComposing) return;
			if (e.shiftKey) return;
			e.preventDefault();
			const { form } = e.currentTarget;
			if ((form?.querySelector("button[type=\"submit\"]"))?.disabled) return;
			form?.requestSubmit();
		}
		if (e.key === "Backspace" && e.currentTarget.value === "" && attachments.files.length > 0) {
			e.preventDefault();
			const lastAttachment = attachments.files.at(-1);
			if (lastAttachment) attachments.remove(lastAttachment.id);
		}
	}, [
		onKeyDown,
		isComposing,
		attachments
	]);
	const handlePaste = useCallback((event) => {
		const items = event.clipboardData?.items;
		if (!items) return;
		const files = [];
		for (const item of items) if (item.kind === "file") {
			const file = item.getAsFile();
			if (file) files.push(file);
		}
		if (files.length > 0) {
			event.preventDefault();
			attachments.add(files);
		}
	}, [attachments]);
	const handleCompositionEnd = useCallback(() => setIsComposing(false), []);
	const handleCompositionStart = useCallback(() => setIsComposing(true), []);
	const controlledProps = controller ? {
		onChange: (e) => {
			controller.textInput.setInput(e.currentTarget.value);
			onChange?.(e);
		},
		value: controller.textInput.value
	} : { onChange };
	return /* @__PURE__ */ jsx(InputGroupTextarea, {
		className: cn("field-sizing-content max-h-48 min-h-16", className),
		name: "message",
		onCompositionEnd: handleCompositionEnd,
		onCompositionStart: handleCompositionStart,
		onKeyDown: handleKeyDown,
		onPaste: handlePaste,
		placeholder,
		...props,
		...controlledProps
	});
};
var PromptInputFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(InputGroupAddon, {
	align: "block-end",
	className: cn("justify-between gap-1", className),
	...props
});
var PromptInputSubmit = ({ className, variant = "default", size = "icon-sm", status, onStop, onClick, children, ...props }) => {
	const isGenerating = status === "submitted" || status === "streaming";
	let Icon = /* @__PURE__ */ jsx(CornerDownLeftIcon, { className: "size-4" });
	if (status === "submitted") Icon = /* @__PURE__ */ jsx(Spinner, {});
	else if (status === "streaming") Icon = /* @__PURE__ */ jsx(SquareIcon, { className: "size-4" });
	else if (status === "error") Icon = /* @__PURE__ */ jsx(XIcon, { className: "size-4" });
	const handleClick = useCallback((e) => {
		if (isGenerating && onStop) {
			e.preventDefault();
			onStop();
			return;
		}
		onClick?.(e);
	}, [
		isGenerating,
		onStop,
		onClick
	]);
	return /* @__PURE__ */ jsx(InputGroupButton, {
		"aria-label": isGenerating ? "Stop" : "Submit",
		className: cn(className),
		onClick: handleClick,
		size,
		type: isGenerating && onStop ? "button" : "submit",
		variant,
		...props,
		children: children ?? Icon
	});
};
//#endregion
//#region src/components/ai-elements/shimmer.tsx
var motionComponentCache = /* @__PURE__ */ new Map();
var getMotionComponent = (element) => {
	let component = motionComponentCache.get(element);
	if (!component) {
		component = motion.create(element);
		motionComponentCache.set(element, component);
	}
	return component;
};
var ShimmerComponent = ({ children, as: Component = "p", className, duration = 2, spread = 2 }) => {
	const MotionComponent = getMotionComponent(Component);
	const dynamicSpread = useMemo(() => (children?.length ?? 0) * spread, [children, spread]);
	return /* @__PURE__ */ jsx(MotionComponent, {
		animate: { backgroundPosition: "0% center" },
		className: cn("relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent", "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]", className),
		initial: { backgroundPosition: "100% center" },
		style: {
			"--spread": `${dynamicSpread}px`,
			backgroundImage: "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))"
		},
		transition: {
			duration,
			ease: "linear",
			repeat: Number.POSITIVE_INFINITY
		},
		children
	});
};
var Shimmer = memo(ShimmerComponent);
//#endregion
//#region src/routes/_authenticated/tutor.$threadId.tsx?tsr-split=component
var STARTERS = [
	"Explain the Pythagorean theorem with a real-life example",
	"Summarise the causes of World War I in 5 bullet points",
	"Quiz me on cell biology — 3 multiple-choice questions",
	"How do I solve quadratic equations? Step by step."
];
function ChatPage() {
	const { threadId } = Route.useParams();
	const qc = useQueryClient();
	const getMsgs = useServerFn(getThreadMessages);
	const setDiff = useServerFn(updateThreadDifficulty);
	const initialQ = useQuery({
		queryKey: ["thread", threadId],
		queryFn: () => getMsgs({ data: { threadId } })
	});
	return /* @__PURE__ */ jsx("div", {
		className: "flex h-full w-full flex-col",
		children: initialQ.isLoading ? /* @__PURE__ */ jsx("div", {
			className: "grid flex-1 place-items-center text-muted-foreground",
			children: /* @__PURE__ */ jsx(Shimmer, { children: "Loading conversation…" })
		}) : initialQ.data ? /* @__PURE__ */ jsx(ChatInner, {
			threadId,
			initialMessages: initialQ.data.rows.map((r) => ({
				id: r.id,
				role: r.role,
				parts: r.parts
			})),
			initialDifficulty: initialQ.data.thread.difficulty,
			onDifficultyChange: async (d) => {
				await setDiff({ data: {
					id: threadId,
					difficulty: d
				} });
				qc.invalidateQueries({ queryKey: ["thread", threadId] });
			}
		}, threadId) : /* @__PURE__ */ jsx("div", {
			className: "grid flex-1 place-items-center text-muted-foreground",
			children: "Chat not found."
		})
	});
}
function ChatInner({ threadId, initialMessages, initialDifficulty, onDifficultyChange }) {
	const qc = useQueryClient();
	const [difficulty, setDifficulty] = useState(initialDifficulty);
	const [input, setInput] = useState("");
	const tokenRef = useRef(null);
	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			tokenRef.current = data.session?.access_token ?? null;
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
			tokenRef.current = session?.access_token ?? null;
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const { messages, sendMessage, status, error } = useChat({
		id: threadId,
		messages: initialMessages,
		transport: useMemo(() => new DefaultChatTransport({
			api: "/api/chat",
			headers: () => {
				const token = tokenRef.current;
				return token ? { Authorization: `Bearer ${token}` } : {};
			},
			body: () => ({
				threadId,
				difficulty
			})
		}), [threadId, difficulty]),
		onFinish: () => {
			qc.invalidateQueries({ queryKey: ["threads"] });
		}
	});
	useEffect(() => {
		if (error) console.error(error);
	}, [error]);
	const busy = status === "submitted" || status === "streaming";
	const submit = async (text) => {
		if (!text.trim() || busy) return;
		setInput("");
		await sendMessage({ text: text.trim() });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-3 backdrop-blur md:px-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 text-primary" }), " Tutor session"]
				}), /* @__PURE__ */ jsx(DifficultyPicker, {
					value: difficulty,
					onChange: (d) => {
						setDifficulty(d);
						onDifficultyChange(d);
					}
				})]
			}),
			/* @__PURE__ */ jsxs(Conversation, {
				className: "flex-1",
				children: [/* @__PURE__ */ jsx(ConversationContent, {
					className: "mx-auto w-full max-w-3xl px-4 py-6 md:px-6",
					children: messages.length === 0 ? /* @__PURE__ */ jsx(ConversationEmptyState, {
						icon: /* @__PURE__ */ jsx("span", {
							className: "bg-gradient-brand grid h-12 w-12 place-items-center rounded-2xl shadow-glow",
							children: /* @__PURE__ */ jsx(Sparkles, { className: "h-6 w-6 text-primary-foreground" })
						}),
						title: "What can I help you study?",
						description: "Ask anything, or try one of these starters.",
						children: /* @__PURE__ */ jsx("div", {
							className: "mt-4 grid w-full max-w-xl gap-2 sm:grid-cols-2",
							children: STARTERS.map((s) => /* @__PURE__ */ jsx("button", {
								onClick: () => submit(s),
								className: "rounded-2xl border border-border bg-card p-3 text-left text-sm text-foreground transition-colors hover:bg-accent",
								children: s
							}, s))
						})
					}) : /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [messages.map((m) => {
							const text = m.parts.map((p) => p.type === "text" ? p.text : "").join("");
							return /* @__PURE__ */ jsx(Message, {
								from: m.role,
								children: m.role === "user" ? /* @__PURE__ */ jsx(MessageContent, { children: text }) : /* @__PURE__ */ jsx("div", {
									className: "prose prose-sm max-w-none break-words text-foreground dark:prose-invert",
									children: /* @__PURE__ */ jsx(MessageResponse, { children: text })
								})
							}, m.id);
						}), status === "submitted" && /* @__PURE__ */ jsx("div", {
							className: "px-2 text-sm",
							children: /* @__PURE__ */ jsx(Shimmer, { children: "Thinking…" })
						})]
					})
				}), /* @__PURE__ */ jsx(ConversationScrollButton, {})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "border-t border-border bg-background/80 p-3 backdrop-blur md:p-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto w-full max-w-3xl",
					children: [/* @__PURE__ */ jsxs(PromptInput, {
						onSubmit: () => {
							submit(input);
						},
						children: [/* @__PURE__ */ jsx(PromptInputTextarea, {
							value: input,
							onChange: (e) => setInput(e.target.value),
							placeholder: "Ask anything…",
							autoFocus: true
						}), /* @__PURE__ */ jsx(PromptInputFooter, {
							className: "justify-end",
							children: /* @__PURE__ */ jsx(PromptInputSubmit, {
								status,
								disabled: !input.trim() || busy
							})
						})]
					}), error && /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-xs text-destructive",
						children: error.message || "Something went wrong. Please try again."
					})]
				})
			})
		]
	});
}
function DifficultyPicker({ value, onChange }) {
	return /* @__PURE__ */ jsx("div", {
		className: "inline-flex rounded-full border border-border bg-card p-0.5 text-xs font-semibold",
		children: [
			{
				v: "simple",
				label: "Simple"
			},
			{
				v: "standard",
				label: "Standard"
			},
			{
				v: "advanced",
				label: "Advanced"
			}
		].map((o) => /* @__PURE__ */ jsx("button", {
			onClick: () => onChange(o.v),
			className: `rounded-full px-3 py-1.5 transition-colors ${value === o.v ? "bg-gradient-brand text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
			children: o.label
		}, o.v))
	});
}
//#endregion
export { ChatPage as component };
