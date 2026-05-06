import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ProductDetailSkeleton() {
    return (
        <div className="space-y-6 text-white max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <Skeleton className="h-9 w-64 md:w-96" />
                    <div className="flex items-center gap-3 mt-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-surface-elevated border-surface-elevated text-white shadow-none">
                        <CardHeader>
                            <Skeleton className="h-6 w-24" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-5 w-28" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>
                            <Separator className="bg-slate-700" />
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-surface-elevated border-surface-elevated text-white shadow-none">
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-surface-elevated border-surface-elevated overflow-hidden shadow-none">
                        <div className="relative aspect-square w-full">
                            <Skeleton className="w-full h-full" />
                        </div>
                    </Card>

                    <Card className="bg-surface-elevated border-surface-elevated shadow-none">
                        <CardHeader>
                            <Skeleton className="h-6 w-24 mb-1" />
                            <Skeleton className="h-4 w-48" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-28" />
                                <Skeleton className="h-5 w-8" />
                            </div>
                            <Separator className="bg-slate-700" />
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            </div>
                            <Separator className="bg-slate-700" />
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
