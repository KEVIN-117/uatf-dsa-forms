import * as React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Add01Icon,
    ArrowDown01Icon,
    ArrowRight01Icon,
    UnfoldMoreIcon,
    Settings01Icon,
    UserAdd01Icon,
    StudentIcon,
    Male02Icon,
    Quiz03Icon,
    TeachingFreeIcons,
    Bitcoin03Icon,
    Home02Icon
} from "@hugeicons/core-free-icons";
import { Link } from "@tanstack/react-router";
import { useProtectedRoute } from "#/hooks/useProtectedRoute";

type IconSvgObject = ([string, {
    [key: string]: string | number;
}])[] | readonly (readonly [string, {
    readonly [key: string]: string | number;
}])[];

type MenuItem = {
    id: string;
    name: string;
    icon: IconSvgObject;
    href: string;
}

type MenuItemGroup = {
    id: string;
    name: string;
    icon: IconSvgObject;
    children: MenuItem[];
}

const workgroups: MenuItemGroup[] = [
    {
        id: "student-report",
        name: "Student Report",
        icon: Male02Icon,
        children: [
            {
                id: "number-of-applicants-by-category-gender",
                name: "Postulantes por modalidad y sexo",
                icon: Quiz03Icon,
                href: "/student-report/stu-num-app-cat-sex",
            },
            {
                id: "number-of-applicants-admitted-by-category-gender",
                name: "Postulantes admitidos por modalidad y sexo",
                icon: Quiz03Icon,
                href: "/student-report/stu-num-app-adm-cat-sex",
            },
            {
                id: "student-enrollment-by-sex",
                name: "Matrícula estudiantil por sexo",
                icon: Quiz03Icon,
                href: "/student-report/stu-enr-sex",
            },
            {
                id: "new-student-enrollment-by-sex",
                name: "Matrícula estudiantes nuevos por sexo",
                icon: Quiz03Icon,
                href: "/student-report/stu-enr-new-sex",
            },
            {
                id: "enrollment-of-regular-students-by-sex",
                name: "Matricula estudiantes regulares por sexo",
                icon: Quiz03Icon,
                href: "/student-report/stu-enr-reg-sex",
            },
            {
                id: "number-of-students-scheduled-by-gender",
                name: "Número de estudiantes programados por sexo",
                icon: Quiz03Icon,
                href: "/student-report/stu-num-prog-sex",
            },
            {
                id: "number-of-students-who-passed-failed-and-dropped-out",
                name: "Número de estudiantes aprobados, reprobados y desertores",
                icon: Quiz03Icon,
                href: "/student-report/stu-num-pass-fail-drop",
            },
        ],
    },
    {
        id: "graduates-report", name: "Graduates report", icon: StudentIcon, children: [
            {
                id: "number-of-graduates-by-modality-and-sex",
                name: "Número de graduados por modalidad y sexo",
                icon: Quiz03Icon,
                href: "/graduates-report/grad-num-mod-sex",
            },
            {
                id: "number-of-graduates-by-academic-level-and-sex",
                name: "Número de graduados por nivel académico y sexo",
                icon: Quiz03Icon,
                href: "/graduates-report/grad-num-acad-sex",
            }
        ]
    },
    {
        id: "teacher-report",
        name: "Reporte docente",
        icon: TeachingFreeIcons,
        children: [
            {
                id: "list-of-teachers",
                name: "Lista de docentes",
                icon: Quiz03Icon,
                href: "/teacher-report/teach-list",
            },
            {
                id: "number-of-teachers-by-academic-level",
                name: "Número de docentes por nivel académico",
                icon: Quiz03Icon,
                href: "/teacher-report/teach-num-acad",
            },
            {
                id: "number-of-teachers-by-modality",
                name: "Número de docentes por modalidad",
                icon: Quiz03Icon,
                href: "/teacher-report/teach-num-mod",
            }
        ]
    },
    {
        id: "scholarship-report",
        name: "Reporte de becas",
        icon: Bitcoin03Icon,
        children: [
            {
                id: "food-scholarship-by-type-and-sex",
                name: "Beca alimentación por tipo y sexo",
                icon: Quiz03Icon,
                href: "/scholarship-report/sch-food-type-sex",
            },
            {
                id: "boarding-school-scholarship",
                name: "Beca Internado",
                icon: Quiz03Icon,
                href: "/scholarship-report/sch-boarding",
            },
            {
                id: "teaching-assistants",
                name: "Auxiliares de docencia",
                icon: Quiz03Icon,
                href: "/scholarship-report/sch-assistants",
            },
            {
                id: "research-grant",
                name: "Beca investigación",
                icon: Quiz03Icon,
                href: "/scholarship-report/sch-research",
            },
            {
                id: "graduation-scholarship",
                name: "Beca graduación",
                icon: Quiz03Icon,
                href: "/scholarship-report/sch-graduation",
            },
            {
                id: "work-scholarship",
                name: "Beca trabajo",
                icon: Quiz03Icon,
                href: "/scholarship-report/sch-work",
            },
            {
                id: "laboratory-scholarship",
                name: "Beca laboratorio",
                icon: Quiz03Icon,
                href: "/scholarship-report/sch-lab",
            }
        ]
    },
];

export function DashboardSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const { isAuthenticated } = useProtectedRoute();
    const [expandedItems, setExpandedItems] = React.useState<string[]>([
        "all-work",
        "website-copy",
    ]);

    const toggleItem = (id: string) => {
        setExpandedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const renderWorkgroupItem = (
        item: MenuItem | MenuItemGroup,
        level: number = 0
    ) => {
        const isExpanded = expandedItems.includes(item.id);
        const Icon = item.icon;
        const paddingLeft = level * 12;

        if ("children" in item && item.children) {
            return (
                <Collapsible
                    key={item.id}
                    open={isExpanded}
                    onOpenChange={() => toggleItem(item.id)}
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger
                            asChild
                        >
                            <SidebarMenuButton
                                className="h-7 text-sm"
                                style={{ paddingLeft: `${8 + paddingLeft}px` }}
                            >
                                <HugeiconsIcon icon={Icon} className="size-3.5" />
                                <span className="flex-1">{item.name}</span>
                                {isExpanded ? (
                                    <HugeiconsIcon icon={ArrowDown01Icon} className="size-3" />
                                ) : (
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                                )}
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub className="mr-0 pr-0">
                                {item.children.map((child) => (
                                    <SidebarMenuSubItem key={child.id}>
                                        {renderWorkgroupItem(
                                            child,
                                            level + 1
                                        )}
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            );
        }

        return renderMenuItem(item as MenuItem, level);
    };

    function renderMenuItem(item: MenuItem, level: number = 0) {
        const paddingLeft = level * 12;
        const Icon = item.icon;

        return (
            <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                    asChild
                    className="h-7 text-sm"
                    style={{ paddingLeft: `${8 + paddingLeft}px` }}
                >
                    <Link to={item.href}>
                        <HugeiconsIcon icon={Icon} className="size-3.5" />
                        <span>{item.name}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <Sidebar className="lg:border-r-0!" collapsible="icon" {...props}>
            <SidebarHeader className="px-2.5 py-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="flex justify-between items-center">
                        <button className="flex items-center gap-2.5 w-full hover:bg-sidebar-accent rounded-md p-1 -m-1 transition-colors shrink-0">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-foreground text-background shrink-0">
                                <img src="dsa-icon.png" alt="logo uatf" className="w-fit h-fit" />
                            </div>
                            <h3 className="text-sm font-medium">UATF</h3>
                            <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                                <HugeiconsIcon icon={UnfoldMoreIcon} className="size-3 text-muted-foreground" />
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <HugeiconsIcon icon={UserAdd01Icon} className="size-4" />
                                <span>Invite members</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>

            <SidebarContent className="px-2.5">
                {isAuthenticated && <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center justify-between px-0 h-6">
                        <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
                            Dashboard
                        </span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link to="/dashboard">
                                    <SidebarMenuButton className="h-7 text-sm">
                                        <HugeiconsIcon icon={Home02Icon} className="size-3.5" />
                                        <span>Dashboard</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link to="/demo/table">
                                    <SidebarMenuButton className="h-7 text-sm">
                                        <HugeiconsIcon icon={Home02Icon} className="size-3.5" />
                                        <span>DemoTable</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link to="/demo/tanstack-query">
                                    <SidebarMenuButton className="h-7 text-sm">
                                        <HugeiconsIcon icon={Home02Icon} className="size-3.5" />
                                        <span>DemoTanstackQuery</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="h-7 text-sm text-muted-foreground">
                                    <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
                                    <span>Crear formulario</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                }
                <SidebarGroup className="p-0 mt-4">
                    <SidebarGroupLabel className="flex items-center justify-between px-0 h-6">
                        <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
                            Lista de Formularios
                        </span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {workgroups.map((item) => renderWorkgroupItem(item))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-2.5 pb-3 group-data-[collapsible=icon]:hidden">

            </SidebarFooter>
        </Sidebar>
    );
}
