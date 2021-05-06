import { IComponentsRegistrar } from '@wix/thunderbolt-components-loader'

type TBElementsCompLibrary = {
	registerComponents: Promise<IComponentsRegistrar['registerComponents']>
}

export const tbElementComponents = async (
	tbElementsPromise: Promise<TBElementsCompLibrary>
): Promise<IComponentsRegistrar> => {
	const tbElements = await tbElementsPromise
	const registerComponents = await tbElements.registerComponents
	return {
		registerComponents,
	}
}
